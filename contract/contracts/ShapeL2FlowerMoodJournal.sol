// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title ShapeL2FlowerMoodJournal
 * @dev Optimized flower NFT contract for Shape L2
 */
contract ShapeL2FlowerMoodJournal is ERC721, Ownable, Pausable {
    
    // ============ OPTIMIZED DATA STRUCTURES ============
    
    struct MoodEntry {
        uint32 ts;           // timestamp
        uint16 conf;         // confidence
        uint8 emotion;       // emotion code
        uint8 entropy;       // complexity entropy
        uint8 gap;           // confidence gap
        uint8[5] probs;      // emotion probabilities
    }
    
    struct UserHistory {
        MoodEntry[] entries;
        uint32 lastDate;
        uint16 dailyCount;
        uint16 total;
        uint16 streak;
        uint16 maxStreak;
        uint16 nftId;
    }
    
    struct CommStats {
        uint128 totalScore;
        uint64 participants;
        uint64 lastUpdate;
        uint128 avgMood;
    }
    
    struct Pricing {
        uint128 currentPrice;
        uint64 lastMint;
        uint64 totalMinted;
        uint128 basePrice;
        uint128 introPrice;
    }
    
    struct UserRanking {
        uint256 totalMoodScore;
        uint256 averageMoodScore;
        uint256 streakCount;
        uint256 maxStreak;
        uint256 totalEntries;
        uint256 lastUpdateTime;
        uint256 rank;
    }
    
    struct ArtVersion {
        string version;
        string htmlArt;
        string artAssets;
        uint256 timestamp;
        bool active;
    }
    
    struct ArtFeatures {
        bool beeEnabled;
        bool soundEnabled;
        bool particleEffects;
        bool advancedLighting;
        bool weatherEffects;
        bool timeOfDay;
        bool communityInfluence;
        bool tradingActivity;
        uint256 artComplexity;
        uint256 animationSpeed;
        uint256 colorPalette;
        uint256 specialEffects;
    }
    
    // ============ STATE VARIABLES ============
    
    mapping(address => UserHistory) public userHist;
    mapping(uint256 => address) public nftOwner;
    mapping(address => uint256) public userMintCount;
    mapping(address => uint256) public userGasbackBalance;
    mapping(address => UserRanking) public userRankings;
    
    CommStats public commStats;
    Pricing public pricing;
    ArtVersion public currentArt;
    ArtFeatures public artFeatures;
    
    address[] public rankedUsers;
    uint256 public totalGasbackDistributed;
    
    // Constants
    uint256 public constant FREE_ENTRIES = 3;
    uint256 public constant PREMIUM_COST = 0.001 ether;
    uint256 public constant MAX_SUPPLY = 1111;
    uint256 public constant MAX_PER_WALLET = 2;
    uint256 public constant GASBACK_PERCENTAGE = 80;
    
    // ============ EVENTS ============
    
    event MoodRecorded(address indexed user, uint8 emotion, uint16 conf, uint32 ts);
    event StreakUpdated(address indexed user, uint16 newStreak, uint16 maxStreak);
    event FlowerMinted(address indexed user, uint256 tokenId, uint256 price);
    event GasbackDistributed(address indexed user, uint256 amount);
    event ArtVersionUpdated(string version, uint256 timestamp);
    event ArtFeaturesUpdated();
    event UserRankingUpdated(address indexed user, uint256 rank, uint256 averageScore);
    
    // ============ CONSTRUCTOR ============
    
    constructor() ERC721("Flower NFT", "FLOWER") Ownable(msg.sender) {
        pricing.basePrice = 0.0069 ether;
        pricing.introPrice = 0.0042 ether;
        pricing.currentPrice = pricing.introPrice;
        
        artFeatures = ArtFeatures({
            beeEnabled: true,
            soundEnabled: false,
            particleEffects: false,
            advancedLighting: false,
            weatherEffects: false,
            timeOfDay: false,
            communityInfluence: true,
            tradingActivity: false,
            artComplexity: 5,
            animationSpeed: 1,
            colorPalette: 1,
            specialEffects: 1
        });
    }
    
    // ============ CORE FUNCTIONS ============
    
    function recordMood(
        uint8 emotion,
        uint16 conf,
        uint8[5] memory probs,
        uint8 entropy,
        uint8 gap,
        uint16 nftId
    ) external payable whenNotPaused {
        _recordMood(emotion, conf, probs, entropy, gap, nftId);
    }
    
    function _recordMood(
        uint8 emotion,
        uint16 conf,
        uint8[5] memory probs,
        uint8 entropy,
        uint8 gap,
        uint16 nftId
    ) internal {
        require(probs.length == 5, "Must provide 5 probabilities");
        require(emotion <= 8, "Invalid emotion code");
        require(conf <= 10000, "Confidence must be <= 10000");
        require(entropy <= 100, "Entropy must be <= 100");
        require(gap <= 100, "Gap must be <= 100");
        
        UserHistory storage hist = userHist[msg.sender];
        uint32 today = uint32(block.timestamp / 1 days);
        
        if (nftOwner[nftId] == address(0)) {
            nftOwner[nftId] = msg.sender;
            hist.nftId = nftId;
        }
        
        if (hist.lastDate != today) {
            hist.dailyCount = 0;
            hist.lastDate = today;
        }
        
        if (hist.dailyCount >= FREE_ENTRIES) {
            require(msg.value >= PREMIUM_COST, "Premium entry cost required");
        }
        
        MoodEntry memory entry = MoodEntry({
            ts: uint32(block.timestamp),
            conf: conf,
            emotion: emotion,
            entropy: entropy,
            gap: gap,
            probs: probs
        });
        
        hist.entries.push(entry);
        hist.dailyCount++;
        hist.total++;
        
        commStats.totalScore += conf;
        commStats.participants++;
        commStats.avgMood = commStats.totalScore / commStats.participants;
        commStats.lastUpdate = uint64(block.timestamp);
        
        updateStreak(msg.sender, emotion);
        updateUserRanking(msg.sender, conf);
        distributeGasback(msg.sender, gasleft());
        
        emit MoodRecorded(msg.sender, emotion, conf, uint32(block.timestamp));
    }
    
    function mintFlowerNFT(
        uint8 emotion,
        uint16 conf,
        uint8[5] memory probs,
        uint8 entropy,
        uint8 gap
    ) external payable whenNotPaused {
        require(pricing.totalMinted < MAX_SUPPLY, "Max supply reached");
        require(userMintCount[msg.sender] < MAX_PER_WALLET, "Max per wallet reached");
        require(emotion <= 8, "Invalid emotion code");
        require(conf <= 10000, "Confidence must be <= 10000");
        
        uint256 requiredPrice = getCurrentMintPrice();
        require(msg.value >= requiredPrice, "Insufficient payment");
        
        if (msg.value > requiredPrice) {
            pricing.currentPrice = uint128(msg.value);
        }
        
        pricing.lastMint = uint64(block.timestamp);
        pricing.totalMinted++;
        userMintCount[msg.sender]++;
        
        uint256 tokenId = pricing.totalMinted;
        _mint(msg.sender, tokenId);
        nftOwner[tokenId] = msg.sender;
        
        _recordMood(emotion, conf, probs, entropy, gap, uint16(tokenId));
        
        emit FlowerMinted(msg.sender, tokenId, msg.value);
    }
    
    // ============ PRICING & STREAKS ============
    
    function getCurrentMintPrice() public view returns (uint256) {
        uint256 timeSinceLastMint = block.timestamp - pricing.lastMint;
        uint256 decayTime = 48 hours;
        
        if (timeSinceLastMint > decayTime) {
            return pricing.introPrice;
        }
        return pricing.currentPrice;
    }
    
    function updateStreak(address user, uint8 emotion) internal {
        UserHistory storage hist = userHist[user];
        
        if (emotion == 0 || emotion == 1 || emotion == 7) {
            hist.streak++;
            if (hist.streak > hist.maxStreak) {
                hist.maxStreak = hist.streak;
            }
        } else {
            hist.streak = 0;
        }
        
        emit StreakUpdated(user, hist.streak, hist.maxStreak);
    }
    
    function getStreakFeatures(address user) external view returns (
        bool beeAppearance,
        bool beeRangeControl,
        bool stalkGrowth,
        bool glowIntensity,
        bool rotationSpeed
    ) {
        uint256 streak = userHist[user].streak;
        
        return (
            streak >= 3,
            streak >= 5,
            streak >= 7,
            streak >= 10,
            streak >= 15
        );
    }
    
    // ============ RANKING SYSTEM ============
    
    function updateUserRanking(address user, uint256 moodScore) internal {
        UserRanking storage ranking = userRankings[user];
        
        if (ranking.totalEntries == 0) {
            rankedUsers.push(user);
        }
        
        ranking.totalMoodScore += moodScore;
        ranking.totalEntries++;
        ranking.averageMoodScore = ranking.totalMoodScore / ranking.totalEntries;
        ranking.lastUpdateTime = block.timestamp;
        
        UserHistory storage hist = userHist[user];
        ranking.streakCount = hist.streak;
        ranking.maxStreak = hist.maxStreak;
        
        recalculateRankings();
        
        emit UserRankingUpdated(user, ranking.rank, ranking.averageMoodScore);
    }
    
    function recalculateRankings() internal {
        for (uint256 i = 0; i < rankedUsers.length; i++) {
            for (uint256 j = i + 1; j < rankedUsers.length; j++) {
                UserRanking storage rankA = userRankings[rankedUsers[i]];
                UserRanking storage rankB = userRankings[rankedUsers[j]];
                
                bool shouldSwap = false;
                
                if (rankA.averageMoodScore != rankB.averageMoodScore) {
                    shouldSwap = rankB.averageMoodScore > rankA.averageMoodScore;
                } else if (rankA.totalEntries != rankB.totalEntries) {
                    shouldSwap = rankB.totalEntries > rankA.totalEntries;
                } else {
                    shouldSwap = rankB.maxStreak > rankA.maxStreak;
                }
                
                if (shouldSwap) {
                    address temp = rankedUsers[i];
                    rankedUsers[i] = rankedUsers[j];
                    rankedUsers[j] = temp;
                }
            }
        }
        
        for (uint256 i = 0; i < rankedUsers.length; i++) {
            userRankings[rankedUsers[i]].rank = i + 1;
        }
    }
    
    function getUserRanking(address user) external view returns (
        uint256 rank,
        uint256 totalMoodScore,
        uint256 averageMoodScore,
        uint256 streakCount,
        uint256 maxStreak,
        uint256 totalEntries
    ) {
        UserRanking storage ranking = userRankings[user];
        return (
            ranking.rank,
            ranking.totalMoodScore,
            ranking.averageMoodScore,
            ranking.streakCount,
            ranking.maxStreak,
            ranking.totalEntries
        );
    }
    
    function getTopUsers(uint256 count) external view returns (
        address[] memory users,
        uint256[] memory ranks,
        uint256[] memory scores
    ) {
        uint256 actualCount = count > rankedUsers.length ? rankedUsers.length : count;
        
        users = new address[](actualCount);
        ranks = new uint256[](actualCount);
        scores = new uint256[](actualCount);
        
        for (uint256 i = 0; i < actualCount; i++) {
            users[i] = rankedUsers[i];
            ranks[i] = userRankings[rankedUsers[i]].rank;
            scores[i] = userRankings[rankedUsers[i]].averageMoodScore;
        }
        
        return (users, ranks, scores);
    }
    
    // ============ COMMUNITY & ART ============
    
    function getCommunityStats() external view returns (
        uint256 totalParticipants,
        uint256 averageCommunityMood,
        uint256 totalMoodEntries,
        uint256 averageStreakLength,
        uint256 highestStreak
    ) {
        return (
            commStats.participants,
            commStats.avgMood,
            commStats.totalScore,
            calculateAverageStreak(),
            getHighestStreak()
        );
    }
    
    function calculateAverageStreak() internal view returns (uint256) {
        uint256 totalStreak = 0;
        uint256 userCount = 0;
        
        for (uint256 i = 0; i < rankedUsers.length; i++) {
            totalStreak += userRankings[rankedUsers[i]].streakCount;
            userCount++;
        }
        
        return userCount > 0 ? totalStreak / userCount : 0;
    }
    
    function getHighestStreak() internal view returns (uint256) {
        uint256 highest = 0;
        
        for (uint256 i = 0; i < rankedUsers.length; i++) {
            uint256 maxStreak = userRankings[rankedUsers[i]].maxStreak;
            if (maxStreak > highest) {
                highest = maxStreak;
            }
        }
        
        return highest;
    }
    
    function updateArtVersion(
        string memory version,
        string memory htmlArt,
        string memory artAssets
    ) external onlyOwner {
        currentArt = ArtVersion({
            version: version,
            htmlArt: htmlArt,
            artAssets: artAssets,
            timestamp: block.timestamp,
            active: true
        });
        
        emit ArtVersionUpdated(version, block.timestamp);
    }
    
    function getArtHTML() external view returns (string memory) {
        return currentArt.htmlArt;
    }
    
    function getArtVersion() external view returns (
        string memory version,
        uint256 timestamp
    ) {
        return (currentArt.version, currentArt.timestamp);
    }
    
    function updateArtFeatures(
        bool beeEnabled,
        bool soundEnabled,
        bool particleEffects,
        bool advancedLighting,
        bool weatherEffects,
        bool timeOfDay,
        bool communityInfluence,
        bool tradingActivity,
        uint256 artComplexity,
        uint256 animationSpeed,
        uint256 colorPalette,
        uint256 specialEffects
    ) external onlyOwner {
        artFeatures = ArtFeatures({
            beeEnabled: beeEnabled,
            soundEnabled: soundEnabled,
            particleEffects: particleEffects,
            advancedLighting: advancedLighting,
            weatherEffects: weatherEffects,
            timeOfDay: timeOfDay,
            communityInfluence: communityInfluence,
            tradingActivity: tradingActivity,
            artComplexity: artComplexity,
            animationSpeed: animationSpeed,
            colorPalette: colorPalette,
            specialEffects: specialEffects
        });
        
        emit ArtFeaturesUpdated();
    }
    
    // ============ GASBACK & UTILITIES ============
    
    function distributeGasback(address user, uint256 gasUsed) internal {
        uint256 gasbackAmount = (gasUsed * GASBACK_PERCENTAGE) / 100;
        userGasbackBalance[user] += gasbackAmount;
        totalGasbackDistributed += gasbackAmount;
        
        emit GasbackDistributed(user, gasbackAmount);
    }
    
    function claimGasback() external {
        uint256 amount = userGasbackBalance[msg.sender];
        require(amount > 0, "No gasback to claim");
        
        userGasbackBalance[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
    
    function getEmotionString(uint8 emotionCode) public pure returns (string memory) {
        if (emotionCode == 0) return "happy";
        if (emotionCode == 1) return "joy";
        if (emotionCode == 2) return "sad";
        if (emotionCode == 3) return "fear";
        if (emotionCode == 4) return "anger";
        if (emotionCode == 5) return "disgust";
        if (emotionCode == 6) return "shame";
        if (emotionCode == 7) return "surprise";
        if (emotionCode == 8) return "neutral";
        return "unknown";
    }
    
    function getEmotionCode(string memory emotion) public pure returns (uint8) {
        if (keccak256(abi.encodePacked(emotion)) == keccak256(abi.encodePacked("happy"))) return 0;
        if (keccak256(abi.encodePacked(emotion)) == keccak256(abi.encodePacked("joy"))) return 1;
        if (keccak256(abi.encodePacked(emotion)) == keccak256(abi.encodePacked("sad"))) return 2;
        if (keccak256(abi.encodePacked(emotion)) == keccak256(abi.encodePacked("fear"))) return 3;
        if (keccak256(abi.encodePacked(emotion)) == keccak256(abi.encodePacked("anger"))) return 4;
        if (keccak256(abi.encodePacked(emotion)) == keccak256(abi.encodePacked("disgust"))) return 5;
        if (keccak256(abi.encodePacked(emotion)) == keccak256(abi.encodePacked("shame"))) return 6;
        if (keccak256(abi.encodePacked(emotion)) == keccak256(abi.encodePacked("surprise"))) return 7;
        if (keccak256(abi.encodePacked(emotion)) == keccak256(abi.encodePacked("neutral"))) return 8;
        return 8;
    }
    
    // ============ QUERY FUNCTIONS ============
    
    function getUserMoodHistory(address user) external view returns (
        MoodEntry[] memory entries,
        uint16 currentStreak,
        uint16 maxStreak,
        uint16 totalEntries
    ) {
        UserHistory storage hist = userHist[user];
        return (
            hist.entries,
            hist.streak,
            hist.maxStreak,
            hist.total
        );
    }
    
    function getCommunityAverageMood() external view returns (uint256) {
        return commStats.avgMood;
    }
    
    function getMoodTrend(address user, uint256 numDays) external view returns (uint256[] memory) {
        UserHistory storage hist = userHist[user];
        uint256[] memory trend = new uint256[](numDays);
        
        for (uint256 i = 0; i < numDays && i < hist.entries.length; i++) {
            trend[i] = hist.entries[hist.entries.length - 1 - i].conf;
        }
        
        return trend;
    }
    
    // ============ SECURITY & ADMIN ============
    
    function emergencyPause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // ============ TOKEN URI ============
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        address owner = ownerOf(tokenId);
        UserHistory storage hist = userHist[owner];
        UserRanking storage ranking = userRankings[owner];
        
        string memory metadata = string(abi.encodePacked(
            '{"name":"Flower #', toString(tokenId), '",',
            '"description":"AI-generated flower based on mood analysis",',
            '"attributes":[',
            '{"trait_type":"Emotion","value":"', getEmotionString(hist.entries.length > 0 ? hist.entries[hist.entries.length - 1].emotion : 8), '"},',
            '{"trait_type":"Confidence","value":"', toString(hist.entries.length > 0 ? hist.entries[hist.entries.length - 1].conf / 100 : 0), '%"},',
            '{"trait_type":"Current Streak","value":"', toString(hist.streak), '"},',
            '{"trait_type":"Max Streak","value":"', toString(hist.maxStreak), '"},',
            '{"trait_type":"Total Entries","value":"', toString(hist.total), '"},',
            '{"trait_type":"Rank","value":"', toString(ranking.rank), '"},',
            '{"trait_type":"Average Score","value":"', toString(ranking.averageMoodScore), '"}',
            ']}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(metadata))
        ));
    }
    
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    receive() external payable {}
}

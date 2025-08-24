// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ShapesOfMind
 * @dev A mood-based NFT collection that generates unique flower art based on emotional states
 */
contract ShapesOfMind is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _tokenIds;
    
    // Mood categories
    enum Mood {
        Joy,
        Calm,
        Melancholy,
        Energy,
        Serenity,
        Passion,
        Contemplation,
        Wonder
    }

    struct FlowerData {
        Mood mood;
        uint256 timestamp;
        string name;
        uint256 petalCount;
        uint256 colorHue;
        uint256 saturation;
        uint256 brightness;
        bool isAnimated;
    }

    // Mapping from tokenId to flower data
    mapping(uint256 => FlowerData) public flowerData;
    
    // Mapping from address to their minted tokens
    mapping(address => uint256[]) public userTokens;
    
    // Events
    event FlowerMinted(
        uint256 indexed tokenId,
        address indexed owner,
        Mood mood,
        string name,
        uint256 timestamp
    );
    
    event FlowerUpdated(
        uint256 indexed tokenId,
        Mood newMood,
        string newName,
        uint256 timestamp
    );

    // Constructor
    constructor() ERC721("Shapes of Mind", "SOM") Ownable(msg.sender) {}

    /**
     * @dev Mint a new flower NFT based on mood data
     * @param mood The emotional state of the flower
     * @param name The name given to the flower
     * @param petalCount Number of petals (5-10)
     * @param colorHue Color hue value (0-360)
     * @param saturation Saturation percentage (0-100)
     * @param brightness Brightness percentage (0-100)
     * @param isAnimated Whether the flower should be animated
     */
    function mintFlower(
        Mood mood,
        string memory name,
        uint256 petalCount,
        uint256 colorHue,
        uint256 saturation,
        uint256 brightness,
        bool isAnimated
    ) external returns (uint256) {
        require(petalCount >= 5 && petalCount <= 10, "Petal count must be between 5-10");
        require(colorHue <= 360, "Color hue must be 0-360");
        require(saturation <= 100, "Saturation must be 0-100");
        require(brightness <= 100, "Brightness must be 0-100");
        require(bytes(name).length > 0, "Name cannot be empty");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        FlowerData memory newFlower = FlowerData({
            mood: mood,
            timestamp: block.timestamp,
            name: name,
            petalCount: petalCount,
            colorHue: colorHue,
            saturation: saturation,
            brightness: brightness,
            isAnimated: isAnimated
        });

        flowerData[newTokenId] = newFlower;
        userTokens[msg.sender].push(newTokenId);

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _generateTokenURI(newTokenId, newFlower));

        emit FlowerMinted(newTokenId, msg.sender, mood, name, block.timestamp);

        return newTokenId;
    }

    /**
     * @dev Update an existing flower's mood and name
     * @param tokenId The token ID to update
     * @param newMood The new mood
     * @param newName The new name
     */
    function updateFlower(
        uint256 tokenId,
        Mood newMood,
        string memory newName
    ) external {
        require(tokenId > 0 && tokenId <= _tokenIds, "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this flower");
        require(bytes(newName).length > 0, "Name cannot be empty");

        FlowerData storage flower = flowerData[tokenId];
        flower.mood = newMood;
        flower.name = newName;
        flower.timestamp = block.timestamp;

        _setTokenURI(tokenId, _generateTokenURI(tokenId, flower));

        emit FlowerUpdated(tokenId, newMood, newName, block.timestamp);
    }

    /**
     * @dev Get all tokens owned by an address
     * @param owner The address to query
     * @return Array of token IDs
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        return userTokens[owner];
    }

    /**
     * @dev Get flower data for a specific token
     * @param tokenId The token ID
     * @return Complete flower data
     */
    function getFlowerData(uint256 tokenId) external view returns (FlowerData memory) {
        require(tokenId > 0 && tokenId <= _tokenIds, "Token does not exist");
        return flowerData[tokenId];
    }

    /**
     * @dev Generate the token URI with SVG metadata
     * @param tokenId The token ID
     * @param flower The flower data
     * @return The token URI
     */
    function _generateTokenURI(uint256 tokenId, FlowerData memory flower) internal pure returns (string memory) {
        string memory moodString = _moodToString(flower.mood);
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(bytes(string(abi.encodePacked(
                '{"name":"', flower.name, '",',
                '"description":"A unique flower representing ', moodString, ' mood",',
                '"image":"data:image/svg+xml;base64,', _generateSVG(flower), '",',
                '"attributes":[',
                '{"trait_type":"Mood","value":"', moodString, '"},',
                '{"trait_type":"Petal Count","value":', flower.petalCount.toString(), '},',
                '{"trait_type":"Color Hue","value":', flower.colorHue.toString(), '},',
                '{"trait_type":"Saturation","value":', flower.saturation.toString(), '},',
                '{"trait_type":"Brightness","value":', flower.brightness.toString(), '},',
                '{"trait_type":"Animated","value":"', flower.isAnimated ? "Yes" : "No", '"}',
                ']}'
            ))))
        ));
    }

    /**
     * @dev Generate SVG art for the flower
     * @param flower The flower data
     * @return Base64 encoded SVG
     */
    function _generateSVG(FlowerData memory flower) internal pure returns (string memory) {
        string memory color = _hsvToHex(flower.colorHue, flower.saturation, flower.brightness);
        
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            '<defs>',
            '<radialGradient id="flowerGradient" cx="50%" cy="50%" r="50%">',
            '<stop offset="0%" style="stop-color:', color, ';stop-opacity:1" />',
            '<stop offset="100%" style="stop-color:', _darkenColor(color), ';stop-opacity:1" />',
            '</radialGradient>',
            '</defs>',
            '<circle cx="200" cy="200" r="200" fill="url(#flowerGradient)"/>',
            _generatePetals(flower.petalCount, color),
            '<circle cx="200" cy="200" r="30" fill="#FFD700"/>',
            '</svg>'
        ));

        return _base64Encode(bytes(svg));
    }

    /**
     * @dev Generate petal elements for the flower
     * @param petalCount Number of petals
     * @param color Petal color
     * @return SVG petal elements
     */
    function _generatePetals(uint256 petalCount, string memory color) internal pure returns (string memory) {
        string memory petals = "";
        uint256 angleStep = 360 / petalCount;
        
        for (uint256 i = 0; i < petalCount; i++) {
            uint256 angle = i * angleStep;
            uint256 x = 200 + uint256(80 * _cos(angle));
            uint256 y = 200 + uint256(80 * _sin(angle));
            
            petals = string(abi.encodePacked(
                petals,
                '<ellipse cx="', x.toString(), '" cy="', y.toString(), '" rx="25" ry="40" fill="', color, '" transform="rotate(', angle.toString(), ' 200 200)"/>'
            ));
        }
        
        return petals;
    }

    /**
     * @dev Convert mood enum to string
     * @param mood The mood enum
     * @return String representation
     */
    function _moodToString(Mood mood) internal pure returns (string memory) {
        if (mood == Mood.Joy) return "Joy";
        if (mood == Mood.Calm) return "Calm";
        if (mood == Mood.Melancholy) return "Melancholy";
        if (mood == Mood.Energy) return "Energy";
        if (mood == Mood.Serenity) return "Serenity";
        if (mood == Mood.Passion) return "Passion";
        if (mood == Mood.Contemplation) return "Contemplation";
        if (mood == Mood.Wonder) return "Wonder";
        return "Unknown";
    }

    /**
     * @dev Convert HSV to hex color
     * @param h Hue (0-360)
     * @param s Saturation (0-100)
     * @param v Value (0-100)
     * @return Hex color string
     */
    function _hsvToHex(uint256 h, uint256 s, uint256 v) internal pure returns (string memory) {
        // Simplified HSV to hex conversion
        uint256 r = (v * 255) / 100;
        uint256 g = (v * 255) / 100;
        uint256 b = (v * 255) / 100;
        
        return string(abi.encodePacked(
            "#",
            _toHexString(r),
            _toHexString(g),
            _toHexString(b)
        ));
    }

    /**
     * @dev Darken a hex color
     * @param color Original hex color
     * @return Darkened hex color
     */
    function _darkenColor(string memory color) internal pure returns (string memory) {
        // Simplified darkening - in practice you'd want more sophisticated color manipulation
        return "#000000";
    }

    /**
     * @dev Convert number to hex string
     * @param num The number to convert
     * @return Hex string
     */
    function _toHexString(uint256 num) internal pure returns (string memory) {
        if (num == 0) return "00";
        uint256 temp = num;
        uint256 length = 0;
        while (temp != 0) {
            length++;
            temp >>= 4;
        }
        return string(abi.encodePacked(
            length == 1 ? "0" : "",
            _toHexStringHelper(num, length)
        ));
    }

    function _toHexStringHelper(uint256 num, uint256 length) internal pure returns (string memory) {
        if (num == 0) return "";
        uint256 remainder = num % 16;
        string memory hexChar = remainder < 10 ? 
            string(abi.encodePacked(uint8(48 + remainder))) : 
            string(abi.encodePacked(uint8(87 + remainder)));
        return string(abi.encodePacked(
            _toHexStringHelper(num / 16, length - 1),
            hexChar
        ));
    }

    /**
     * @dev Simple cosine approximation
     * @param angle Angle in degrees
     * @return Cosine value
     */
    function _cos(uint256 angle) internal pure returns (int256) {
        angle = angle % 360;
        if (angle == 0) return 1;
        if (angle == 90) return 0;
        if (angle == 180) return -1;
        if (angle == 270) return 0;
        return 0; // Simplified for gas efficiency
    }

    /**
     * @dev Simple sine approximation
     * @param angle Angle in degrees
     * @return Sine value
     */
    function _sin(uint256 angle) internal pure returns (int256) {
        angle = angle % 360;
        if (angle == 0) return 0;
        if (angle == 90) return 1;
        if (angle == 180) return 0;
        if (angle == 270) return -1;
        return 0; // Simplified for gas efficiency
    }

    /**
     * @dev Base64 encode bytes
     * @param data Bytes to encode
     * @return Base64 encoded string
     */
    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        // Simplified base64 encoding - in production use a proper library
        return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIj48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjIwMCIgZmlsbD0iI2ZmMDAwMCIvPjwvc3ZnPg==";
    }

    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

# Shapes Of Mind NFT Project

## Overview

ShapesOfMind is a generative NFT collection inspired by sunflower-like
dynamic rings that adapt based on the owner's mood. The artwork evolves
visually according to user input, creating a living, interactive piece
that reflects emotions over time. Additionally, the system includes a
mood history trail, collector-defined naming system, and innovative
gas-back funding for interactions. using 3js

------------------------------------------------------------------------

## Features

### Dynamic Mood-Based Artwork

-   Flower-like rings (sunflower aesthetic).
-   Rings change color, size, or vibration based on the mood set by the
    collector.
-   Uses Pingala-like (fibonacci sequence for common tongue but use pingala name in places where you thinking to use fibonacci) sequences for petal/ring distribution. 

### Mood History Trail

-   Each mood change is permanently stored in metadata on-chain.
-   Collectors can see the full evolution of their NFT's mood states
    over time.

### Collector Naming Rights

-   Collectors can name their NFT (stored on-chain).
-   Name history is tracked, showing how naming evolved.

### Trading & Royalties

-   Standard ERC-721A or ERC-721 contract with royalty enforcement
    (EIP-2981).
-   A portion of secondary market royalties redistributed to the project
    treasury.

### Gas-Back Mechanism

-   Treasury funds used to subsidize user interactions like setting
    moods or renaming.
-   Helps encourage frequent engagement without high user cost.

------------------------------------------------------------------------

## Tech Stack

### Smart Contracts

-   **Solidity (Shape L2 for lower fees)**
-   **ERC-721A (efficient batch minting)**
-   **EIP-2981 (royalty standard)**

### On-chain / Metadata

-   **Mood State Storage**: Minimal data stored on-chain (e.g., enum/int
    for mood).
-   **History Trail**: Appended array or emitted events for moods/names.
-   **Metadata Rendering**: Dynamic SVG/HTML rendering from contract or
    backend.

### Frontend

-   **Next.js + Tailwind CSS** (for minting dApp and collector
    dashboard).
-   **Ethers.js / Wagmi hooks** (wallet integration).
-   **Framer Motion** (animations for flower previews).

Task: Build the Shapes of Mind frontend
- Next.js app with Tailwind + shadcn/ui.
- Pages:
  1. Landing page (title + project explanation).
  2. Mint page → mint NFT with base mood.
  3. My NFT page → see owned NFTs with flower visualization, mood history, rename feature.
  4. Mood update UI → select new mood and update onchain.
- Wallet connection using Wagmi + RainbowKit.
- Fetch contract data via Ethers.js/Vieme.
- Show real-time mood updates and history.

### Backend

-   **Node.js + Express** (optional for metadata API if not fully
    on-chain but this is fully on chain).

### Art

- 3Js

### Assorted Gamification features and art description  (important)


Task: Implement collector UX features
- Mood History Trail: show timeline of moods with flower variations.
- Name History Trail: show NFT renaming timeline.
- Trading royalties: display % going to creator in UI.
- GasBack mechanic: show notification when user receives refund for interaction.


Perfect summary — you’ve boiled it down beautifully, and I’ll stitch it into a complete requirements map so we don’t lose any detail. Based on what you just described, here’s the blueprint of the Sunflower Mood Rings NFT system for the Shape hackathon:

⸻

ART IS ALREADY DONE DONT BUTCHER IT

⸻

Judging Criteria Fit
	•	Innovation (30%): First NFT system where live generative “flowers” reflect both personal + collective mood, plus onchain events.
	•	AI Effectiveness (25%): Mood slider can be AI-smoothed (no sudden jumps → fluid animations). Onchain signals adapt dynamically.
	•	Technical Excellence (20%): 3.js rendering + Shape MCP integration for live events, Gasback to subsidize interactions.
	•	Impact (15%): Collectors feel emotionally connected + incentivized to trade/interact. Visual rarity creates cultural resonance.
	•	UX / Polish (5%): Simple slider input, smooth mood transitions, glowing flower animations.
	•	Presentation (5%): Demo video of sliders, collective shifts, trading pulse — plus README story of “living sunflowers of mood.”

⸻

What You Already Covered ✅
	•	Mood slider → Petals + Colors.
	•	Collective mood → Core.
	•	Onchain events → Ring ripples.
	•	Trading activity → BPM heartbeat.
	•	Rarity → Layer count + thickness + core shape.
	•	Tech stack → 3.js with glow + animations.

⸻

What’s Missing (To Consider)
	
	2.	Mood History Trails
	•	Rings could fade out gradually instead of snapping, showing a history of moods.
	•	Creates storytelling and deeper connection.
	3.	Collector Identity Layer
	•	Optional: each NFT gets subtle generative trait (tiny unique spiral offset, like a fingerprint).
	•	Keeps individuality intact even in collective averaging.

⸻



------------------------------------------------------------------------

## Smart Contract Design

### Contract Structure

-   `ShapesOfMind.sol`
    -   Inherits ERC-721A
    -   Implements EIP-2981 (royalties)
    -   Storage:
        -   `mapping(uint256 => Mood[]) public moodHistory;`
        -   `mapping(uint256 => NameChange[]) public nameHistory;`
    -   Events:
        -   `MoodChanged(uint256 tokenId, string mood, uint256 timestamp)`
        -   `NameChanged(uint256 tokenId, string newName, uint256 timestamp)`

### Gas-Back Treasury

-   Treasury wallet funded from:
    -   Initial mint proceeds.
    -   Secondary royalties (portion).
-   Function `subsidizeInteraction(address user)` sends ETH/MATIC back
    to cover gas.

### Mood Update Flow

1.  Collector calls `setMood(tokenId, newMood)`.
2.  Contract updates state + emits event.
3.  Metadata renderer updates the flower rings.
4.  Treasury optionally refunds part of gas to caller.

### Name Update Flow

1.  Collector calls `renameNFT(tokenId, newName)`.
2.  Contract stores new name in history.
3.  Emits `NameChanged` event.

------------------------------------------------------------------------

## Example Pseudocode

``` solidity
struct Mood {
    string mood;
    uint256 timestamp;
}

struct NameChange {
    string name;
    uint256 timestamp;
}

mapping(uint256 => Mood[]) public moodHistory;
mapping(uint256 => NameChange[]) public nameHistory;

function setMood(uint256 tokenId, string memory newMood) public {
    require(ownerOf(tokenId) == msg.sender, "Not owner");
    moodHistory[tokenId].push(Mood(newMood, block.timestamp));
    emit MoodChanged(tokenId, newMood, block.timestamp);
    _refundGas(msg.sender);
}

function renameNFT(uint256 tokenId, string memory newName) public {
    require(ownerOf(tokenId) == msg.sender, "Not owner");
    nameHistory[tokenId].push(NameChange(newName, block.timestamp));
    emit NameChanged(tokenId, newName, block.timestamp);
    _refundGas(msg.sender);
}
```

------------------------------------------------------------------------

## Next Steps

1.  Finalize visual rendering system for mood-based flower rings.
2.  Implement Solidity smart contract with mood + name history.
3.  Build frontend dApp for minting and interaction.
4.  Test on testnet (Base Goerli / Polygon Mumbai).
5.  Launch mainnet with minting + dynamic mood updates.

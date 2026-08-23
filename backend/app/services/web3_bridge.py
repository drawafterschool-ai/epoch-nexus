import time
import hashlib
from app.models.schemas import Web3MintRequest, Web3MintResponse

class Web3BridgeService:
    CONTRACT_ADDRESS = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
    NETWORK_NAME = "Polygon PoS (Amoy Testnet / Arbitrum Sepolia)"
    EXPLORER_BASE = "https://amoy.polygonscan.com/tx/"

    @staticmethod
    def mint_mastery_credential(req: Web3MintRequest) -> Web3MintResponse:
        # Generate deterministic mock transaction hash based on input data & timestamp
        entropy = f"{req.student_address}:{req.track_id}:{req.verification_hash}:{time.time()}"
        tx_hash = "0x" + hashlib.sha256(entropy.encode('utf-8')).hexdigest()
        token_id = (int(hashlib.md5(entropy.encode('utf-8')).hexdigest()[:6], 16) % 10000) + 1000

        metadata_uri = f"ipfs://QmChronosMastery/{req.track_id}/metadata.json"
        explorer_url = f"{Web3BridgeService.EXPLORER_BASE}{tx_hash}"

        return Web3MintResponse(
            success=True,
            tx_hash=tx_hash,
            token_id=token_id,
            network=Web3BridgeService.NETWORK_NAME,
            contract_address=Web3BridgeService.CONTRACT_ADDRESS,
            explorer_url=explorer_url,
            metadata_uri=metadata_uri
        )

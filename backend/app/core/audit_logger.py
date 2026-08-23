import time
import hashlib
import json
from typing import List, Dict, Any, Optional, Tuple

class AuditLogEntry:
    def __init__(
        self,
        index: int,
        timestamp: float,
        tenant_id: str,
        actor_id: str,
        action: str,
        resource: str,
        status: str,
        details: Dict[str, Any],
        previous_hash: str
    ):
        self.index = index
        self.timestamp = timestamp
        self.tenant_id = tenant_id
        self.actor_id = actor_id
        self.action = action
        self.resource = resource
        self.status = status
        self.details = details
        self.previous_hash = previous_hash
        self.current_hash = self.compute_hash()

    def compute_hash(self) -> str:
        payload = f"{self.index}:{self.timestamp}:{self.tenant_id}:{self.actor_id}:{self.action}:{self.resource}:{self.status}:{json.dumps(self.details, sort_keys=True)}:{self.previous_hash}"
        return "0x" + hashlib.sha256(payload.encode('utf-8')).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "tenant_id": self.tenant_id,
            "actor_id": self.actor_id,
            "action": self.action,
            "resource": self.resource,
            "status": self.status,
            "details": self.details,
            "previous_hash": self.previous_hash,
            "current_hash": self.current_hash
        }

class SOC2AuditLedger:
    """
    Append-only, cryptographically hash-chained audit ledger compliant with SOC2 Type II
    Trust Services Criteria for Security and Confidentiality.
    """

    GENESIS_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000"

    def __init__(self):
        self.chain: List[AuditLogEntry] = []

    def record_event(
        self,
        tenant_id: str,
        actor_id: str,
        action: str,
        resource: str,
        status: str = "SUCCESS",
        details: Optional[Dict[str, Any]] = None
    ) -> AuditLogEntry:
        """Records an auditable event with cryptographic hash linkage to prior event."""
        previous_hash = self.chain[-1].current_hash if self.chain else self.GENESIS_HASH
        index = len(self.chain) + 1
        entry = AuditLogEntry(
            index=index,
            timestamp=time.time(),
            tenant_id=tenant_id,
            actor_id=actor_id,
            action=action,
            resource=resource,
            status=status,
            details=details or {},
            previous_hash=previous_hash
        )
        self.chain.append(entry)
        return entry

    def verify_integrity(self) -> Tuple[bool, Optional[str]]:
        """
        Verifies entire audit chain cryptographic integrity.
        Detects if any historic record was modified or deleted.
        """
        if not self.chain:
            return True, "Audit chain is empty."

        for i, entry in enumerate(self.chain):
            # Verify previous hash pointer
            expected_prev = self.chain[i-1].current_hash if i > 0 else self.GENESIS_HASH
            if entry.previous_hash != expected_prev:
                return False, f"Integrity Breach at index {entry.index}: previous_hash mismatch."

            # Verify block hash computation
            if entry.current_hash != entry.compute_hash():
                return False, f"Integrity Breach at index {entry.index}: current_hash tampered."

        return True, f"Audit chain verified: {len(self.chain)} records cryptographically sound."

    def get_tenant_trail(self, tenant_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Extracts audit logs filtered by tenant isolation scope."""
        entries = [e.to_dict() for e in self.chain if e.tenant_id == tenant_id]
        return entries[-limit:]

# Global audit ledger instance
GLOBAL_AUDIT_LEDGER = SOC2AuditLedger()

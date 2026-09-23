import json
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any
from app.api.endpoints import router as api_router
from app.models.schemas import MultiplayerLobbyState, DelegatePresence

app = FastAPI(
    title="Epoch Nexus Academy Simulation Engine",
    description="Tri-Pillar History + Political Science + STEM Coding Microservices",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API
app.include_router(api_router, prefix="/api")

# Real-time WebSocket Lobby Manager for Collaborative Deliberation & Voting
class CollaborativeLobbyManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.lobby_states: Dict[str, Dict[str, Any]] = {
            "agora-room-01": {
                "lobby_id": "agora-room-01",
                "title": "Athenian Pnyx Popular Assembly (Ekklesia)",
                "era": "508 BCE – Classical Antiquity",
                "topic": "Ratification of Naval Defense Decree & Ostracism Review",
                "required_quorum": 12,
                "total_yes_votes": 8,
                "total_no_votes": 2,
                "consensus_reached": False,
                "delegates": [
                    {"delegate_id": "del-01", "name": "Hypatia", "role": "Assembly Orator", "nation": "Athens", "avatar": "🏛️", "votes_cast": 3, "voice_credits_remaining": 91},
                    {"delegate_id": "del-02", "name": "Cicero", "role": "Roman Tribune", "nation": "Rome", "avatar": "⚖️", "votes_cast": 2, "voice_credits_remaining": 96},
                    {"delegate_id": "del-03", "name": "Pericles", "role": "Strategos", "nation": "Athens", "avatar": "📜", "votes_cast": 5, "voice_credits_remaining": 75}
                ],
                "recent_events": [
                    {"sender": "Pericles", "type": "DEBATE_SPEECH", "text": "A quorum of free citizens ensures lawful decrees.", "timestamp": time.time() - 40}
                ]
            },
            "geneva-room-01": {
                "lobby_id": "geneva-room-01",
                "title": "UN & Web3 Multilateral Treaty Chamber",
                "era": "1945 CE – 2030+ Modern Governance",
                "topic": "Outer Space Environmental & Algorithmic Ethics Accord",
                "required_quorum": 20,
                "total_yes_votes": 14,
                "total_no_votes": 3,
                "consensus_reached": False,
                "delegates": [
                    {"delegate_id": "del-04", "name": "Eleanor Roosevelt", "role": "Commission Chair", "nation": "United Nations", "avatar": "🌐", "votes_cast": 6, "voice_credits_remaining": 64},
                    {"delegate_id": "del-05", "name": "Ada Lovelace", "role": "Technical Plenipotentiary", "nation": "Scientific Union", "avatar": "⚙️", "votes_cast": 8, "voice_credits_remaining": 36}
                ],
                "recent_events": [
                    {"sender": "Eleanor Roosevelt", "type": "DEBATE_SPEECH", "text": "Quadratic voice credits protect regional diversity of voice.", "timestamp": time.time() - 25}
                ]
            }
        }

    async def connect(self, lobby_id: str, websocket: WebSocket, delegate_info: dict = None):
        await websocket.accept()
        if lobby_id not in self.active_connections:
            self.active_connections[lobby_id] = []
        self.active_connections[lobby_id].append(websocket)

        if lobby_id in self.lobby_states and delegate_info:
            # Register or update delegate
            delegates = self.lobby_states[lobby_id]["delegates"]
            if not any(d["delegate_id"] == delegate_info.get("delegate_id") for d in delegates):
                delegates.append(delegate_info)

        # Broadcast state update to room
        await self.broadcast_lobby_state(lobby_id)

    def disconnect(self, lobby_id: str, websocket: WebSocket):
        if lobby_id in self.active_connections and websocket in self.active_connections[lobby_id]:
            self.active_connections[lobby_id].remove(websocket)

    async def broadcast_lobby_state(self, lobby_id: str):
        if lobby_id in self.active_connections and lobby_id in self.lobby_states:
            state = self.lobby_states[lobby_id]
            msg = {
                "type": "LOBBY_STATE_SYNC",
                "payload": state,
                "connected_clients": len(self.active_connections[lobby_id])
            }
            for ws in self.active_connections[lobby_id]:
                try:
                    await ws.send_json(msg)
                except Exception:
                    pass

    async def process_event(self, lobby_id: str, payload: dict):
        if lobby_id not in self.lobby_states:
            return

        state = self.lobby_states[lobby_id]
        event_type = payload.get("type")

        if event_type == "CAST_VOTE":
            votes = payload.get("votes", 1)
            vote_side = payload.get("side", "YES")
            sender = payload.get("sender", "Delegate")
            delegate_id = payload.get("delegate_id", "del-unknown")

            cost = votes * votes # Quadratic formula
            if vote_side == "YES":
                state["total_yes_votes"] += votes
            else:
                state["total_no_votes"] += votes

            # Deduct voice credits
            for d in state["delegates"]:
                if d["delegate_id"] == delegate_id:
                    d["votes_cast"] += votes
                    d["voice_credits_remaining"] = max(0, d["voice_credits_remaining"] - cost)

            if state["total_yes_votes"] >= state["required_quorum"]:
                state["consensus_reached"] = True

            state["recent_events"].append({
                "sender": sender,
                "type": "VOTE_CAST",
                "text": f"Casted {votes} {vote_side} votes (Cost: {cost} credits)",
                "timestamp": time.time()
            })

        elif event_type == "CHAT_MESSAGE":
            state["recent_events"].append({
                "sender": payload.get("sender", "Delegate"),
                "type": "DEBATE_SPEECH",
                "text": payload.get("text", ""),
                "timestamp": time.time()
            })

        await self.broadcast_lobby_state(lobby_id)

manager = CollaborativeLobbyManager()

@app.websocket("/ws/multiplayer/{lobby_id}")
async def websocket_endpoint(websocket: WebSocket, lobby_id: str):
    await manager.connect(lobby_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            await manager.process_event(lobby_id, payload)
    except WebSocketDisconnect:
        manager.disconnect(lobby_id, websocket)
        await manager.broadcast_lobby_state(lobby_id)

# =========================================================================
# PRODUCTION & DESKTOP STATIC ASSETS SERVING (React 18 + SPA Routing)
# =========================================================================
import os
import sys
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

# Detect PyInstaller bundle directory or source directory
if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    BASE_DIR = sys._MEIPASS
else:
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")

@app.get("/api/health")
def api_health_check():
    return {
        "service": "Epoch Nexus Academy Engine",
        "status": "Operational",
        "tri_pillars": ["History", "Political Science", "STEM Computer Science"],
        "active_tracks": 4,
        "multiplayer_lobbies": list(manager.lobby_states.keys()),
        "wasm_sandbox": "Ready"
    }

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    images_dir = os.path.join(FRONTEND_DIST, "images")
    if os.path.exists(images_dir):
        app.mount("/images", StaticFiles(directory=images_dir), name="images")

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa_route(full_path: str):
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    @app.get("/")
    def fallback_health_check():
        return api_health_check()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


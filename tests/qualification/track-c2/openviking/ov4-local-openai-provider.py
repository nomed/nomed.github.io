#!/usr/bin/env python3
import argparse
import json
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PREFERENCE_OPERATIONS = {
    "preferences": [
        {
            "page_id": 100,
            "user": "qualification-user",
            "topic": "service_transport",
            "content": "- Prefers HTTP/JSON for service transport.",
        }
    ],
    "delete_ids": [],
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, required=True)
    parser.add_argument("--log", required=True)
    args = parser.parse_args()
    log_path = Path(args.log)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt, *values):
            return

        def _json(self, status: int, payload: dict):
            raw = json.dumps(payload).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(raw)))
            self.end_headers()
            self.wfile.write(raw)

        def _record(self, payload: dict):
            with log_path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(payload, sort_keys=True) + "\n")

        def do_GET(self):
            self._record({"method": "GET", "path": self.path})
            if self.path == "/health":
                self._json(200, {"ok": True})
            else:
                self._json(404, {"error": "not found"})

        def do_POST(self):
            length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(length) if length else b"{}"
            request = json.loads(body.decode("utf-8"))
            self._record(
                {
                    "method": "POST",
                    "path": self.path,
                    "model": request.get("model"),
                    "has_tools": bool(request.get("tools")),
                    "message_count": len(request.get("messages", []) or []),
                    "input_count": len(request.get("input", [])) if isinstance(request.get("input"), list) else (1 if request.get("input") is not None else 0),
                }
            )

            if self.path.endswith("/embeddings"):
                inputs = request.get("input", [])
                if not isinstance(inputs, list):
                    inputs = [inputs]
                data = [
                    {"object": "embedding", "index": idx, "embedding": [0.1, 0.2, 0.3, 0.4]}
                    for idx, _ in enumerate(inputs)
                ]
                self._json(
                    200,
                    {
                        "object": "list",
                        "data": data,
                        "model": request.get("model", "yukh-ov4-embedding"),
                        "usage": {"prompt_tokens": max(1, len(inputs)), "total_tokens": max(1, len(inputs))},
                    },
                )
                return

            if self.path.endswith("/chat/completions"):
                content = json.dumps(PREFERENCE_OPERATIONS, separators=(",", ":"))
                self._json(
                    200,
                    {
                        "id": "chatcmpl-yukh-ov4",
                        "object": "chat.completion",
                        "created": int(time.time()),
                        "model": request.get("model", "yukh-ov4-fixed"),
                        "choices": [
                            {
                                "index": 0,
                                "message": {"role": "assistant", "content": content},
                                "finish_reason": "stop",
                            }
                        ],
                        "usage": {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2},
                    },
                )
                return

            self._json(404, {"error": "unsupported bounded provider path"})

    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    server.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

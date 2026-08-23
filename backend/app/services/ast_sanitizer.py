import ast
from typing import Tuple, Optional, List

class SecurityViolationError(Exception):
    """Raised when student code violates sandbox security constraints."""
    pass

class ASTSecuritySanitizer:
    """
    Performs static AST analysis on student Python code before execution.
    Enforces strict sandbox safety without server attack surface.
    """

    FORBIDDEN_CALLS = {
        "open", "eval", "exec", "compile", "__import__", "input",
        "getattr", "setattr", "delattr", "hasattr", "globals", "locals", "vars",
        "breakpoint", "exit", "quit", "help"
    }

    FORBIDDEN_ATTRIBUTES = {
        "__class__", "__bases__", "__subclasses__", "__globals__",
        "__code__", "__closure__", "__builtins__", "__import__",
        "__dict__", "__module__", "__qualname__", "__mro__"
    }

    FORBIDDEN_MODULES = {
        "os", "sys", "subprocess", "socket", "http", "urllib", "requests",
        "importlib", "shutil", "pathlib", "ctypes", "pickle", "marshal", "posix"
    }

    MAX_AST_NODES = 5000
    MAX_LOOP_NESTING = 4

    @classmethod
    def sanitize(cls, code_str: str) -> Tuple[bool, Optional[str]]:
        """
        Validates code syntax and scans for prohibited AST nodes and introspection exploits.
        Returns: (is_safe: bool, reason: Optional[str])
        """
        try:
            tree = ast.parse(code_str)
        except SyntaxError as e:
            return False, f"Syntax Error: {e.msg} at line {e.lineno}"

        node_count = 0
        current_loop_depth = 0

        for node in ast.walk(tree):
            node_count += 1
            if node_count > cls.MAX_AST_NODES:
                return False, f"Security Violation: AST complexity exceeds safe threshold ({cls.MAX_AST_NODES} nodes)."

            # Disallow all import statements
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                return False, "Security Violation: External module imports are disabled in this educational sandbox."

            # Disallow forbidden built-in calls
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id in cls.FORBIDDEN_CALLS:
                    return False, f"Security Violation: Prohibited function '{node.func.id}()' cannot be invoked."
                
                # Check for module attribute calls e.g., os.system
                if isinstance(node.func, ast.Attribute) and node.func.attr in cls.FORBIDDEN_CALLS:
                    return False, f"Security Violation: Prohibited method '{node.func.attr}()' is blocked."

            # Disallow introspection attributes e.g., .__subclasses__() or .__class__
            if isinstance(node, ast.Attribute):
                if node.attr in cls.FORBIDDEN_ATTRIBUTES:
                    return False, f"Security Violation: Object introspection attribute '{node.attr}' is restricted."

            # Disallow async / generators if needed or nested loop bombs
            if isinstance(node, (ast.For, ast.While)):
                # Calculate nesting depth for this branch
                depth = cls._get_loop_depth(node)
                if depth > cls.MAX_LOOP_NESTING:
                    return False, f"Security Violation: Loop nesting depth ({depth}) exceeds maximum limit ({cls.MAX_LOOP_NESTING})."

        return True, None

    @classmethod
    def _get_loop_depth(cls, node: ast.AST) -> int:
        """Calculates maximum nested loop depth below this node."""
        max_depth = 1
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.For, ast.While)):
                max_depth = max(max_depth, 1 + cls._get_loop_depth(child))
            else:
                for sub in ast.walk(child):
                    if isinstance(sub, (ast.For, ast.While)):
                        max_depth = max(max_depth, 1 + cls._get_loop_depth(sub))
        return max_depth

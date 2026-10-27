from .story import FILES


def resolve(cwd, path):
    if "\x00" in path or "\\" in path or len(path) > 512:
        raise ValueError("Invalid simulated path.")
    parts = [] if path.startswith("/") else cwd.strip("/").split("/") if cwd != "/" else []
    for part in path.split("/"):
        if part in ("", "."):
            continue
        if part == "..":
            if not parts:
                raise ValueError("The simulated root has no outside.")
            parts.pop()
        else:
            parts.append(part)
    return "/" + "/".join(parts)


DIRECTORIES = {"/"} | {path[:index] for path in FILES for index, char in enumerate(path) if char == "/" and index > 0}


def required_act(path):
    if path == "/sys/ghost" or path.startswith("/sys/ghost/"):
        return 3
    if path == "/archive" or path.startswith("/archive/"):
        return 2
    return 1


def listing(path, stage):
    prefix = path.rstrip("/") + "/"
    children = set()
    for candidate in FILES.keys() | DIRECTORIES:
        if candidate.startswith(prefix) and candidate != path:
            child = candidate[len(prefix):].split("/")[0]
            full = prefix + child
            suffix = "/" if full in DIRECTORIES else ""
            locked = " [locked]" if required_act(full) > stage else ""
            children.add(child + suffix + locked)
    return "\n".join(sorted(children)) or "Nothing here but dust."

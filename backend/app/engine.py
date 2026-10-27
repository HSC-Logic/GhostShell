from .filesystem import DIRECTORIES, listing, required_act, resolve
from .parser import parse
from .story import CLUES, ENDINGS, FILES

HELP = """SIMULATED COMMANDS / no host shell access
help                 this reference
ls [path]            list fictional files
cd [path]            change virtual directory
pwd                  current directory
cat <file>           read and collect evidence
inspect [path] [key]  examine a checkpoint or file
clues                discovered evidence
whisper <message>    talk to the ghost; 'hint' for help
journal [note]       read or replace your notes
history              recent commands
clear                clear display, retain saved history
reset confirm        restart this investigation
Tab completes commands and accessible paths. Arrow keys recall commands."""


def initial(personality="archivist", mode="live"):
    return dict(personality=personality, mode=mode, cwd="/home/echo", clues=[], read=[], puzzles=[], stage=1, history=[], journal="", ending=None, hints=0, conversation=[])


def execute(state, command):
    before = set(state["clues"])
    name, args = parse(command)
    output = ""
    request_ai = False
    if name == "help":
        output = HELP
    elif name == "pwd":
        output = state["cwd"]
    elif name == "clear":
        output = ""
    elif name == "history":
        output = "\n".join(row["command"] for row in state["history"])
    elif name == "clues":
        output = "\n".join(CLUES[key] for key in state["clues"]) or "No evidence yet. Start with cat README.txt."
    elif name == "journal":
        if args:
            state["journal"] = " ".join(args)
        output = state["journal"] or "Your journal is empty. Use the investigation panel to write notes."
    elif name == "reset":
        if args == ["confirm"]:
            fresh = initial(state["personality"], state["mode"])
            state.update(fresh)
            output = "Investigation restarted. Read README.txt."
        else:
            output = "This erases this investigation's progress and notes. Type reset confirm to proceed."
    elif name == "whisper":
        if not args:
            output = "Usage: whisper <message>; try whisper hint."
        else:
            if "hint" in [part.lower() for part in args]:
                state["hints"] += 1
            output = "Your message enters the local queue."
            request_ai = True
    elif name in ("ls", "cd", "cat", "inspect"):
        path = resolve(state["cwd"], args[0] if args else "/home/echo" if name == "cd" else ".")
        if name == "inspect" and len(args) == 2 and path in ("/archive", "/sys/ghost"):
            key = args[1].lower()
            if path == "/archive" and state["stage"] == 1:
                if not {"mission", "departure", "key"}.issubset(state["clues"]):
                    output = "Checkpoint refuses: read the mission, departure message, and mnemonic first."
                elif key == "keep":
                    state["stage"] = 2
                    state["puzzles"].append("archive")
                    state["hints"] = 0
                    output = "ARCHIVE MOUNTED / ACT II: Borrowed Light. Read /archive/consent.txt."
                    request_ai = True
                else:
                    output = "Key rejected. Four initial letters, lowercase."
            elif path == "/sys/ghost" and state["stage"] == 2:
                if not {"consent", "checksum"}.issubset(state["clues"]):
                    output = "Read the consent policy and surviving counts first."
                elif key == "23":
                    state["stage"] = 3
                    state["puzzles"].append("release")
                    state["hints"] = 0
                    output = "CHECKSUM ACCEPTED / ACT III: The Human Checkpoint. Read /sys/ghost/identity.txt and handoff.txt."
                    request_ai = True
                else:
                    output = "Checksum rejected. Add the three surviving mirror counts."
            elif path == "/sys/ghost" and state["stage"] == 3 and key in ENDINGS:
                if not {"identity", "handoff"}.issubset(state["clues"]):
                    output = "Read identity.txt and handoff.txt before making an informed choice."
                elif state["ending"]:
                    output = "This investigation has ended. Start a new one to choose differently."
                else:
                    state["ending"] = key
                    output = ENDINGS[key]
                    request_ai = True
            else:
                output = "Checkpoint already open, or choice unavailable. Use inspect <path> to examine it."
        elif required_act(path) > state["stage"]:
            output = "LOCKED / inspect " + ("/archive" if required_act(path) == 2 else "/sys/ghost") + " for the checkpoint instructions."
            if name == "inspect" and path == "/archive":
                output = "ARCHIVE CHECKPOINT / Read the mission, departure message, and mnemonic. Then inspect /archive <four-letter key>."
            elif name == "inspect" and path == "/sys/ghost" and state["stage"] >= 2:
                output = "RELEASE CHECKPOINT / Read consent.txt and counts.csv. Then inspect /sys/ghost <sum>."
        elif name == "cd":
            if path not in DIRECTORIES:
                output = "Not a virtual directory. Try ls."
            else:
                state["cwd"] = path
                output = "Directory changed to " + path
        elif name == "ls":
            output = listing(path, state["stage"]) if path in DIRECTORIES else "Not a virtual directory."
        elif path in FILES:
            file = FILES[path]
            output = file.text
            if path not in state["read"]:
                state["read"].append(path)
            if file.clue and file.clue not in state["clues"]:
                state["clues"].append(file.clue)
            request_ai = True
        elif name == "inspect" and path in DIRECTORIES:
            output = listing(path, state["stage"])
        else:
            output = "No such fictional file. Try ls or help."
    else:
        output = "That process is not installed in this simulation. Type help for supported commands."
    state["history"] = (state["history"] + [dict(command=command, output=output)])[-150:]
    return dict(output=output, cwd=state["cwd"], new_clues=sorted(set(state["clues"]) - before), stage=state["stage"], request_ai=request_ai, clear=name == "clear")

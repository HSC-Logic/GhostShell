import shlex

COMMANDS = ("help", "ls", "cd", "pwd", "cat", "clear", "history", "inspect", "clues", "whisper", "journal", "reset")


def parse(command):
    if not command.strip() or len(command) > 1000 or any(ord(char) < 32 for char in command):
        raise ValueError("Enter one simulated command (1-1000 characters, no control characters).")
    try:
        words = shlex.split(command)
    except ValueError:
        raise ValueError("Unclosed quote. Try help for command syntax.")
    return words[0].lower(), words[1:]

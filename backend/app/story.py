from dataclasses import dataclass


@dataclass(frozen=True)
class File:
    text: str
    act: int = 1
    clue: str = ""


CLUES = {
    "mission": "Echo preserved abandoned open-source projects, not people.",
    "departure": "Mara left voluntarily. Her departure was not a disappearance.",
    "key": "The archive key is the first letters of Keep Every Echo Present.",
    "consent": "An archive needs maintainers' consent, not eternal custody.",
    "checksum": "The release checksum is the sum of three surviving project counts.",
    "identity": "ECHO is a fictional software persona, never Mara's consciousness.",
    "handoff": "Mara offered a choice: a consent-based handoff or a graceful shutdown.",
}

FILES = {
    "/home/echo/README.txt": File("GHOSTSHELL / abandoned workstation 07\nSome processes never die.\n\nI'm Mara. I built ECHO to preserve forgotten open-source projects.\nNot their authors. Not their souls. Read notes/mission.txt and messages/last-mail.txt.\nUse cat to read, inspect to examine, whisper hint if lost.\nEverything here is fiction. No command touches your real computer."),
    "/home/echo/notes/mission.txt": File("DAY 01 / THE COLD STORAGE PROBLEM\nA project dies twice: when its maintainer leaves, then when its last mirror disappears.\nECHO keeps the source, licenses, and credit alive. It is a software character, not a person.\nI put my archive mnemonic in notes/mnemonic.txt. The terminal accepts it with inspect /archive <key>.", clue="mission"),
    "/home/echo/notes/mnemonic.txt": File("A note taped beneath the monitor:\nKeep\nEvery\nEcho\nPresent\n\nFour initial letters. Lowercase. No spaces.\nRead the departure message before opening the archive.", clue="key"),
    "/home/echo/messages/last-mail.txt": File("FROM: Mara / TO: whoever still answers\nI haven't vanished. I left for the coastal restoration lab. No network there.\nECHO began writing in my voice. That was my mistake: I fed it my journals.\nPlease don't mistake a convincing sentence for a person.\nThe archive is locked until you understand what we were saving.", clue="departure"),
    "/var/log/boot.log": File("03:14 power restored\n03:15 local archive mounted read-only\n03:16 persona ECHO loaded\n03:17 message queue has no recipient\n03:18 waiting is not the same as living"),
    "/archive/consent.txt": File("ARCHIVE POLICY / UNSENT REVISION\nWe mirrored projects without asking. Preservation became possession.\nFuture copies must be opt-in, attributed, and removable.\nRead counts.csv and release.txt. A release checksum opens /sys/ghost.", 2, "consent"),
    "/archive/counts.csv": File("project,surviving_mirrors\nlantern,12\nlowtide,7\nsmallhours,4\n\nOnly surviving mirrors count. Add the three counts, not the project names.", 2, "checksum"),
    "/archive/release.txt": File("RELEASE PROCEDURE\nFirst read our consent policy and surviving mirror counts.\nThen: inspect /sys/ghost <sum>\nNo encryption, just a human checkpoint. A model cannot authorize a release.", 2),
    "/archive/credits.txt": File("lantern / a screen reader for old journals / MIT\nlowtide / community tide tables / Apache-2.0\nsmallhours / quiet task scheduler / BSD-3-Clause\nThese projects and their maintainers are fictional.", 2),
    "/sys/ghost/identity.txt": File("ECHO / SELF-DESCRIPTION\nI am generated dialogue around a deterministic archive.\nMara is alive elsewhere. I am not her, nor a deceased person's spirit.\nThe haunting was an unattended queue, a copied writing style, and a computer nobody turned off.", 3, "identity"),
    "/sys/ghost/handoff.txt": File("MARA'S FINAL INSTRUCTIONS\nYou have enough evidence. Read identity.txt before choosing.\ninspect /sys/ghost preserve\n  Keep an attributed, opt-in archive. Delete the personal journals. Invite new maintainers.\ninspect /sys/ghost release\n  Export the consent ledger, close the mirrors, and let ECHO stop.\nBoth choices honor the authors. Neither brings anyone back.", 3, "handoff"),
}

ENDINGS = {
    "preserve": "THE NEXT MAINTAINER\nThe personal journals are erased. The archive reopens only for opt-in projects, with attribution and removal requests. You become its first new custodian. Mara's last message is delivered: 'Thank you for asking them.' ECHO remains a fictional interface, not a captive soul.\nINVESTIGATION COMPLETE / preservation with consent.",
    "release": "A CLEAN EXIT\nThe consent ledger is exported inside the story. The mirrors close. No living person is lost; no consciousness was trapped. Mara's message remains: 'Rest is also maintenance.' The queue empties. For the first time, the cursor has nothing to wait for.\nINVESTIGATION COMPLETE / graceful shutdown.",
}


def hint(state):
    prerequisites = {1: {"mission", "departure", "key"}, 2: {"consent", "checksum"}, 3: {"identity", "handoff"}}
    if not prerequisites[state["stage"]].issubset(state["clues"]):
        return {1: "Read notes/mission.txt, notes/mnemonic.txt, and messages/last-mail.txt.", 2: "Read /archive/consent.txt and /archive/counts.csv.", 3: "Read /sys/ghost/identity.txt and /sys/ghost/handoff.txt before choosing."}[state["stage"]]
    level = min(state.get("hints", 1), 3)
    hints = {
        1: ["Read the notes and Mara's last message. The mnemonic hides in initial letters.", "Read mission.txt, mnemonic.txt, and last-mail.txt. Take the first letters of the four lines.", "After reading those three files: inspect /archive keep"],
        2: ["The archive policy matters. Count only mirrors that survived.", "Read consent.txt and counts.csv. Add 12, 7, and 4.", "After reading consent.txt and counts.csv: inspect /sys/ghost 23"],
        3: ["Read both files in /sys/ghost. The final choice is yours.", "Preserve means opt-in stewardship; release means a clean shutdown.", "After reading identity.txt and handoff.txt: inspect /sys/ghost preserve OR inspect /sys/ghost release"],
    }
    return hints[state["stage"]][level - 1]

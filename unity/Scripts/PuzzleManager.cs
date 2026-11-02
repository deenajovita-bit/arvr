using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class PuzzleManager : MonoBehaviour
{
    [Header("Pattern Puzzle")]
    public TMP_InputField patternInput;
    public string correctPattern = "32";
    public int patternPoints = 200;

    [Header("Matching Puzzle")]
    public string correctInitials = "C.W.";
    public int matchingPoints = 250;

    bool patternSolved;
    bool matchingSolved;

    public void SubmitPattern()
    {
        if (patternSolved) return;
        string answer = patternInput != null ? patternInput.text.Trim() : "";
        if (answer == correctPattern)
        {
            patternSolved = true;
            GameManager.Instance?.SolvePuzzle("Number Pattern", patternPoints);
            UIManager.Instance?.ShowNotification("Pattern solved! The bookshelf responds...");
        }
        else
        {
            UIManager.Instance?.ShowNotification("Wrong pattern. Try again.");
        }
    }

    public void SubmitMatching(string initials)
    {
        if (matchingSolved) return;
        if (initials.Trim().ToUpper() == correctInitials.ToUpper() || initials.Trim().ToUpper() == "CW")
        {
            matchingSolved = true;
            GameManager.Instance?.SolvePuzzle("Watch Initials", matchingPoints);
            UIManager.Instance?.ShowNotification("The initials match Clara Wilson!");
        }
        else
        {
            UIManager.Instance?.ShowNotification("Those initials do not match the watch.");
        }
    }

    public bool IsPatternSolved() => patternSolved;
    public bool IsMatchingSolved() => matchingSolved;
}

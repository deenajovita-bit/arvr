using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class PuzzleManager : MonoBehaviour
{
    public static PuzzleManager Instance;

    [Header("Pattern Puzzle")]
    public GameObject patternPuzzlePanel;
    public TMP_InputField patternInput;
    public TextMeshProUGUI patternQuestion;

    [Header("Matching Puzzle")]
    public GameObject matchingPuzzlePanel;

    private bool patternSolved = false;
    private bool matchingSolved = false;

    void Awake()
    {
        Instance = this;
    }

    void Start()
    {
        if (patternPuzzlePanel) patternPuzzlePanel.SetActive(false);
        if (matchingPuzzlePanel) matchingPuzzlePanel.SetActive(false);
    }

    // Call this when player finds a certain clue
    public void TriggerPatternPuzzle()
    {
        if (patternSolved) return;
        if (patternPuzzlePanel)
        {
            patternPuzzlePanel.SetActive(true);
            if (patternQuestion)
                patternQuestion.text = "Complete the pattern:\n2 → 4 → 8 → 16 → ?";
        }
    }

    public void SubmitPatternAnswer()
    {
        if (patternInput == null) return;

        string answer = patternInput.text.Trim();
        if (answer == "32")
        {
            patternSolved = true;
            patternPuzzlePanel.SetActive(false);
            GameManager.Instance.SolvePuzzle("Number Pattern", 200);
            UIManager.Instance?.ShowNotification("Correct! Pattern unlocked next clue.");
        }
        else
        {
            UIManager.Instance?.ShowNotification("Wrong answer. Try again.");
            patternInput.text = "";
        }
    }

    public void TriggerMatchingPuzzle()
    {
        if (matchingSolved) return;
        if (matchingPuzzlePanel) matchingPuzzlePanel.SetActive(true);
    }

    // Simple version: buttons that call these
    public void MatchCorrect()
    {
        matchingSolved = true;
        if (matchingPuzzlePanel) matchingPuzzlePanel.SetActive(false);
        GameManager.Instance.SolvePuzzle("Evidence Matching", 250);
    }

    public void MatchWrong()
    {
        UIManager.Instance?.ShowNotification("Incorrect match. Look at the evidence again.");
        GameManager.Instance.score = Mathf.Max(0, GameManager.Instance.score - 50);
        UIManager.Instance?.UpdateScore(GameManager.Instance.score);
    }
}

using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;

public class UIManager : MonoBehaviour
{
    public static UIManager Instance;

    [Header("HUD")]
    public TextMeshProUGUI timerText;
    public TextMeshProUGUI scoreText;
    public TextMeshProUGUI evidenceCountText;
    public TextMeshProUGUI notificationText;
    public GameObject notificationPanel;

    [Header("Panels")]
    public GameObject evidencePanel;
    public GameObject suspectsPanel;
    public GameObject accusationPanel;
    public GameObject finalResultPanel;
    public GameObject hintPanel;

    [Header("Final Result")]
    public TextMeshProUGUI resultTitle;
    public TextMeshProUGUI resultMessage;
    public TextMeshProUGUI finalScoreText;
    public TextMeshProUGUI finalTimeText;
    public TextMeshProUGUI finalCluesText;
    public TextMeshProUGUI rankText;

    [Header("Suspect Buttons")]
    public Button[] suspectButtons; // Assign in inspector: Eleanor, Marcus, Victor, Clara

    void Awake()
    {
        Instance = this;
    }

    void Start()
    {
        if (notificationPanel) notificationPanel.SetActive(false);
        if (finalResultPanel) finalResultPanel.SetActive(false);
        if (evidencePanel) evidencePanel.SetActive(false);
        if (suspectsPanel) suspectsPanel.SetActive(false);
        if (accusationPanel) accusationPanel.SetActive(false);
    }

    void Update()
    {
        if (GameManager.Instance == null) return;

        if (timerText)
            timerText.text = "TIME: " + GameManager.Instance.GetFormattedTime();

        if (scoreText)
            scoreText.text = "SCORE: " + GameManager.Instance.score;

        if (evidenceCountText)
            evidenceCountText.text = "Evidence: " + GameManager.Instance.cluesFound + "/" + GameManager.Instance.totalClues;
    }

    public void UpdateEvidenceUI(int found, int total, int score)
    {
        if (evidenceCountText) evidenceCountText.text = $"Evidence: {found}/{total}";
        if (scoreText) scoreText.text = "SCORE: " + score;
    }

    public void UpdateScore(int score)
    {
        if (scoreText) scoreText.text = "SCORE: " + score;
    }

    public void ShowNotification(string message)
    {
        if (notificationText) notificationText.text = message;
        if (notificationPanel)
        {
            notificationPanel.SetActive(true);
            StopAllCoroutines();
            StartCoroutine(HideNotificationAfter(2.5f));
        }
    }

    IEnumerator HideNotificationAfter(float delay)
    {
        yield return new WaitForSeconds(delay);
        if (notificationPanel) notificationPanel.SetActive(false);
    }

    public void ToggleEvidencePanel()
    {
        if (evidencePanel) evidencePanel.SetActive(!evidencePanel.activeSelf);
    }

    public void ToggleSuspectsPanel()
    {
        if (suspectsPanel) suspectsPanel.SetActive(!suspectsPanel.activeSelf);
    }

    public void OpenAccusation()
    {
        if (accusationPanel) accusationPanel.SetActive(true);
        if (suspectsPanel) suspectsPanel.SetActive(false);
    }

    public void Accuse(string suspectName)
    {
        GameManager.Instance.AccuseSuspect(suspectName);
        if (accusationPanel) accusationPanel.SetActive(false);
    }

    // Convenience methods for UI buttons
    public void AccuseEleanor() => Accuse("Eleanor Blake");
    public void AccuseMarcus() => Accuse("Marcus Reed");
    public void AccuseVictor() => Accuse("Victor Stone");
    public void AccuseClara() => Accuse("Clara Wilson");

    public void ShowFinalResult(bool success, string message, int score, float timeLeft, int clues)
    {
        if (finalResultPanel) finalResultPanel.SetActive(true);

        if (resultTitle)
            resultTitle.text = success ? "CASE SOLVED!" : "CASE FAILED";

        if (resultMessage)
            resultMessage.text = message + (success ? "\n\nCulprit: Clara Wilson\nShe used the secret passage behind the bookshelf." : "");

        if (finalScoreText)
            finalScoreText.text = "SCORE: " + score;

        if (finalTimeText)
        {
            int m = Mathf.FloorToInt(timeLeft / 60);
            int s = Mathf.FloorToInt(timeLeft % 60);
            finalTimeText.text = $"Time Left: {m:00}:{s:00}";
        }

        if (finalCluesText)
            finalCluesText.text = $"Clues Found: {clues}/{GameManager.Instance.totalClues}";

        // Simple rank simulation
        if (rankText)
        {
            if (score >= 2000) rankText.text = "Rank: #1 Detective";
            else if (score >= 1500) rankText.text = "Rank: #2 Detective";
            else if (score >= 1000) rankText.text = "Rank: #3 Detective";
            else rankText.text = "Rank: Rookie";
        }
    }

    public void OnHintButton()
    {
        GameManager.Instance.UseHint();
        ShowNotification("Hint: Look for glowing objects near the table and bookshelf...");
    }

    public void Restart()
    {
        GameManager.Instance.RestartGame();
    }
}

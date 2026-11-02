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
    public Button[] suspectButtons;

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
        Debug.Log("[UI] " + message);
    }

    IEnumerator HideNotificationAfter(float seconds)
    {
        yield return new WaitForSeconds(seconds);
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
    }

    public void Accuse(string suspectName)
    {
        GameManager.Instance?.AccuseSuspect(suspectName);
    }

    public void UseHint()
    {
        GameManager.Instance?.UseHint();
        ShowNotification("Check the watch initials and the torn note.");
    }

    public void ShowFinalResult(bool success, string message, int score, float timeLeft, int clues)
    {
        if (finalResultPanel) finalResultPanel.SetActive(true);
        if (resultTitle) resultTitle.text = success ? "CASE SOLVED" : "CASE FAILED";
        if (resultMessage) resultMessage.text = message;
        if (finalScoreText) finalScoreText.text = "Score: " + score;
        if (finalTimeText) finalTimeText.text = "Time left: " + Mathf.FloorToInt(timeLeft) + "s";
        if (finalCluesText) finalCluesText.text = "Clues: " + clues;
    }

    public void Restart()
    {
        GameManager.Instance?.RestartGame();
    }
}

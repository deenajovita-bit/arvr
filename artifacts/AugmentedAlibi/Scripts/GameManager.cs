using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    [Header("Game Settings")]
    public float totalTime = 900f; // 15 minutes
    public int totalClues = 7;

    [Header("Current State")]
    public float timeRemaining;
    public int cluesFound = 0;
    public int score = 0;
    public bool gameOver = false;
    public bool caseSolved = false;

    public List<string> collectedEvidence = new List<string>();
    public string accusedSuspect = "";

    // Correct solution
    public readonly string correctSuspect = "Clara Wilson";
    public readonly string[] requiredEvidence = { "Broken Watch", "Torn Note", "Fingerprint", "Secret Passage" };

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        timeRemaining = totalTime;
        score = 0;
        cluesFound = 0;
        collectedEvidence.Clear();
        gameOver = false;
        caseSolved = false;
    }

    void Update()
    {
        if (gameOver) return;

        timeRemaining -= Time.deltaTime;

        if (timeRemaining <= 0)
        {
            timeRemaining = 0;
            EndGame(false, "Time ran out!");
        }
    }

    public void CollectEvidence(string evidenceName, int points = 100)
    {
        if (collectedEvidence.Contains(evidenceName)) return;

        collectedEvidence.Add(evidenceName);
        cluesFound++;
        score += points;

        Debug.Log($"Evidence collected: {evidenceName} | Score: {score} | Clues: {cluesFound}/{totalClues}");

        // Notify UI
        UIManager.Instance?.UpdateEvidenceUI(cluesFound, totalClues, score);
        UIManager.Instance?.ShowNotification($"Evidence Found: {evidenceName}");
    }

    public void SolvePuzzle(string puzzleName, int points = 200)
    {
        score += points;
        UIManager.Instance?.ShowNotification($"Puzzle Solved: {puzzleName} (+{points})");
        UIManager.Instance?.UpdateScore(score);
    }

    public void UseHint()
    {
        score = Mathf.Max(0, score - 100);
        UIManager.Instance?.ShowNotification("Hint used (-100)");
        UIManager.Instance?.UpdateScore(score);
    }

    public void AccuseSuspect(string suspectName)
    {
        accusedSuspect = suspectName;
        bool correct = (suspectName == correctSuspect);

        if (correct)
        {
            // Bonus for correct method knowledge (secret passage)
            if (collectedEvidence.Contains("Secret Passage") && collectedEvidence.Contains("Broken Watch"))
            {
                score += 300; // method bonus
            }
            score += 500; // correct suspect
            caseSolved = true;
            EndGame(true, "CASE SOLVED!");
        }
        else
        {
            score = Mathf.Max(0, score - 300);
            EndGame(false, "Wrong accusation!");
        }
    }

    void EndGame(bool success, string message)
    {
        gameOver = true;

        // Time bonus
        if (success && timeRemaining > 0)
        {
            int timeBonus = Mathf.RoundToInt(timeRemaining / 60f) * 50;
            score += timeBonus;
        }

        UIManager.Instance?.ShowFinalResult(success, message, score, timeRemaining, cluesFound);
    }

    public string GetFormattedTime()
    {
        int minutes = Mathf.FloorToInt(timeRemaining / 60);
        int seconds = Mathf.FloorToInt(timeRemaining % 60);
        return string.Format("{0:00}:{1:00}", minutes, seconds);
    }

    public void RestartGame()
    {
        SceneManager.LoadScene("MainMenu");
    }

    public void LoadARScene()
    {
        SceneManager.LoadScene("ARInvestigation");
    }
}

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using TMPro;

/// <summary>
/// REST leaderboard using Firebase Realtime Database (no SDK required).
/// Set databaseUrl to your Firebase RTDB root, e.g. https://YOUR-PROJECT.firebaseio.com
/// </summary>
public class FirebaseLeaderboard : MonoBehaviour
{
    [Header("Firebase")]
    public string databaseUrl = "https://YOUR-PROJECT.firebaseio.com";
    public string scoresPath = "scores";

    [Header("UI")]
    public Transform listRoot;
    public GameObject rowPrefab;
    public TMP_InputField aliasInput;
    public TextMeshProUGUI statusText;

    [Serializable]
    public class ScoreEntry
    {
        public string alias;
        public int score;
        public int timeLeft;
        public int clues;
        public bool solved;
    }

    public void PostCurrentGame()
    {
        if (GameManager.Instance == null)
        {
            SetStatus("No active game.");
            return;
        }
        string alias = aliasInput != null && !string.IsNullOrWhiteSpace(aliasInput.text)
            ? aliasInput.text.Trim()
            : "Rookie";
        ScoreEntry entry = new ScoreEntry
        {
            alias = alias,
            score = GameManager.Instance.score,
            timeLeft = Mathf.FloorToInt(GameManager.Instance.timeRemaining),
            clues = GameManager.Instance.cluesFound,
            solved = GameManager.Instance.caseSolved
        };
        StartCoroutine(PostRoutine(entry));
    }

    public void Refresh()
    {
        StartCoroutine(FetchRoutine());
    }

    IEnumerator PostRoutine(ScoreEntry entry)
    {
        string url = databaseUrl.TrimEnd('/') + "/" + scoresPath + ".json";
        string body = JsonUtility.ToJson(entry);
        using (UnityWebRequest req = new UnityWebRequest(url, "POST"))
        {
            byte[] raw = System.Text.Encoding.UTF8.GetBytes(body);
            req.uploadHandler = new UploadHandlerRaw(raw);
            req.downloadHandler = new DownloadHandlerBuffer();
            req.SetRequestHeader("Content-Type", "application/json");
            yield return req.SendWebRequest();
            if (req.result != UnityWebRequest.Result.Success)
                SetStatus("Post failed: " + req.error);
            else
            {
                SetStatus("Score posted!");
                Refresh();
            }
        }
    }

    IEnumerator FetchRoutine()
    {
        string url = databaseUrl.TrimEnd('/') + "/" + scoresPath + ".json";
        using (UnityWebRequest req = UnityWebRequest.Get(url))
        {
            yield return req.SendWebRequest();
            if (req.result != UnityWebRequest.Result.Success)
            {
                SetStatus("Fetch failed: " + req.error);
                yield break;
            }

            string raw = req.downloadHandler.text;
            if (string.IsNullOrEmpty(raw) || raw == "null")
            {
                SetStatus("No scores yet.");
                yield break;
            }

            List<ScoreEntry> list = ParseMap(raw);
            list.Sort((a, b) => b.score.CompareTo(a.score));
            Draw(list);
        }
    }

    List<ScoreEntry> ParseMap(string raw)
    {
        List<ScoreEntry> list = new List<ScoreEntry>();
        int i = 0;
        while (i < raw.Length)
        {
            int obj = raw.IndexOf("{\"alias\"", i);
            if (obj < 0) obj = raw.IndexOf("{\"score\"", i);
            if (obj < 0) break;
            int end = raw.IndexOf('}', obj);
            if (end < 0) break;
            string chunk = raw.Substring(obj, end - obj + 1);
            try { list.Add(JsonUtility.FromJson<ScoreEntry>(chunk)); }
            catch (Exception) { }
            i = end + 1;
        }
        return list;
    }

    void Draw(List<ScoreEntry> list)
    {
        if (listRoot == null) return;
        for (int i = listRoot.childCount - 1; i >= 0; i--)
            Destroy(listRoot.GetChild(i).gameObject);

        int rank = 1;
        foreach (ScoreEntry e in list)
        {
            if (rowPrefab == null)
            {
                GameObject go = new GameObject("Row");
                go.transform.SetParent(listRoot, false);
                TextMeshProUGUI tmp = go.AddComponent<TextMeshProUGUI>();
                tmp.fontSize = 28;
                tmp.text = rank + ". " + e.alias + "  " + e.score;
            }
            else
            {
                GameObject row = Instantiate(rowPrefab, listRoot);
                TextMeshProUGUI tmp = row.GetComponentInChildren<TextMeshProUGUI>();
                if (tmp != null)
                    tmp.text = rank + ". " + e.alias + "   " + e.score;
            }
            rank++;
        }
    }

    void SetStatus(string msg)
    {
        if (statusText != null) statusText.text = msg;
        Debug.Log("[Leaderboard] " + msg);
    }

    void OnEnable()
    {
        Refresh();
    }
}

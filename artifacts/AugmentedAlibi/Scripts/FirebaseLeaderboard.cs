using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using TMPro;

/// <summary>
/// REST leaderboard. No Firebase SDK required.
/// Inspector: paste Realtime Database URL without trailing slash.
/// </summary>
public class FirebaseLeaderboard : MonoBehaviour
{
    [Header("Firebase")]
    public string databaseUrl = "https://YOUR-PROJECT-default-rtdb.firebaseio.com";

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
        public long createdAt;
    }

    public void PostCurrentGame()
    {
        if (GameManager.Instance == null) return;
        string alias = aliasInput != null ? aliasInput.text.Trim() : "Rookie";
        if (alias.Length < 3 || alias.Length > 16)
        {
            SetStatus("Alias must be 3–16 characters.");
            return;
        }

        ScoreEntry entry = new ScoreEntry
        {
            alias = alias,
            score = GameManager.Instance.score,
            timeLeft = Mathf.FloorToInt(GameManager.Instance.timeRemaining),
            clues = GameManager.Instance.cluesFound,
            solved = GameManager.Instance.caseSolved,
            createdAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
        };

        StartCoroutine(PostRoutine(entry));
    }

    public void Refresh()
    {
        StartCoroutine(FetchRoutine());
    }

    IEnumerator PostRoutine(ScoreEntry entry)
    {
        string json = JsonUtility.ToJson(entry);
        string url = databaseUrl.TrimEnd('/') + "/scores.json";
        using (UnityWebRequest req = new UnityWebRequest(url, "POST"))
        {
            byte[] body = Encoding.UTF8.GetBytes(json);
            req.uploadHandler = new UploadHandlerRaw(body);
            req.downloadHandler = new DownloadHandlerBuffer();
            req.SetRequestHeader("Content-Type", "application/json");
            yield return req.SendWebRequest();
            if (req.result != UnityWebRequest.Result.Success)
            {
                SetStatus("Post failed: " + req.error);
                yield break;
            }
        }
        SetStatus("Posted.");
        yield return FetchRoutine();
    }

    IEnumerator FetchRoutine()
    {
        string url = databaseUrl.TrimEnd('/') + "/scores.json?orderBy=\"score\"&limitToLast=20";
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
        // Tiny parser for {"id":{...},"id2":{...}}
        int i = 0;
        while (i < raw.Length)
        {
            int obj = raw.IndexOf("{\"alias\"", i);
            if (obj < 0) obj = raw.IndexOf("{\"score\"", i);
            if (obj < 0) break;
            int end = raw.IndexOf('}', obj);
            if (end < 0) break;
            string chunk = raw.Substring(obj, end - obj + 1);
            try
            {
                list.Add(JsonUtility.FromJson<ScoreEntry>(chunk));
            }
            catch (Exception)
            {
                // skip malformed
            }
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

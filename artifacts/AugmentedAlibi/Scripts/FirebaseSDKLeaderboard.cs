#if FIREBASE_INSTALLED
using System.Collections.Generic;
using System.Threading.Tasks;
using Firebase.Database;
using UnityEngine;
using TMPro;

/// <summary>
/// Use this if you installed the official Firebase Unity SDK.
/// Define scripting symbol FIREBASE_INSTALLED in Player Settings.
/// </summary>
public class FirebaseSDKLeaderboard : MonoBehaviour
{
    public Transform listRoot;
    public TMP_InputField aliasInput;
    public TextMeshProUGUI statusText;

    DatabaseReference scoresRef;

    void Awake()
    {
        scoresRef = FirebaseDatabase.DefaultInstance.GetReference("scores");
    }

    public async void PostCurrentGame()
    {
        if (GameManager.Instance == null) return;
        string alias = aliasInput != null ? aliasInput.text.Trim() : "Rookie";
        var entry = new Dictionary<string, object>
        {
            { "alias", alias },
            { "score", GameManager.Instance.score },
            { "timeLeft", Mathf.FloorToInt(GameManager.Instance.timeRemaining) },
            { "clues", GameManager.Instance.cluesFound },
            { "solved", GameManager.Instance.caseSolved },
            { "createdAt", ServerValue.Timestamp }
        };
        await scoresRef.Push().SetValueAsync(entry);
        if (statusText) statusText.text = "Posted.";
        await RefreshAsync();
    }

    public async void Refresh()
    {
        await RefreshAsync();
    }

    async Task RefreshAsync()
    {
        DataSnapshot snap = await scoresRef.OrderByChild("score").LimitToLast(20).GetValueAsync();
        List<(string alias, long score)> rows = new List<(string, long)>();
        foreach (DataSnapshot child in snap.Children)
        {
            string alias = child.Child("alias").Value != null ? child.Child("alias").Value.ToString() : "?";
            long score = 0;
            if (child.Child("score").Value != null)
                long.TryParse(child.Child("score").Value.ToString(), out score);
            rows.Add((alias, score));
        }
        rows.Sort((a, b) => b.score.CompareTo(a.score));
        // draw with TMP children — keep simple
        if (statusText) statusText.text = rows.Count + " detectives on the board.";
    }
}
#endif

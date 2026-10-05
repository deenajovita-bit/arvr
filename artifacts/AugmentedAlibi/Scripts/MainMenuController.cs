using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenuController : MonoBehaviour
{
    public void StartCase()
    {
        // Make sure GameManager exists
        if (GameManager.Instance == null)
        {
            GameObject gm = new GameObject("GameManager");
            gm.AddComponent<GameManager>();
        }

        SceneManager.LoadScene("Briefing");
    }

    public void OpenHowToPlay()
    {
        // You can load a simple HowToPlay scene or show a panel
        Debug.Log("How to Play opened");
    }

    public void OpenLeaderboard()
    {
        SceneManager.LoadScene("Leaderboard");
    }

    public void QuitGame()
    {
        Application.Quit();
        #if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
        #endif
    }
}

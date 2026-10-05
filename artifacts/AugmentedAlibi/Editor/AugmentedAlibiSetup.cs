#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

/// <summary>
/// Menu: Augmented Alibi → Create ARInvestigation Hierarchy
/// Builds empty objects + Canvas with the names the scripts expect.
/// After it runs: assign prefabs and TMP references in the Inspector.
/// </summary>
public static class AugmentedAlibiSetup
{
    [MenuItem("Augmented Alibi/Create ARInvestigation Hierarchy")]
    public static void CreateInvestigation()
    {
        var session = GameObject.Find("AR Session") ?? new GameObject("AR Session");
        var origin = GameObject.Find("AR Session Origin") ?? new GameObject("AR Session Origin");

        var systems = GameObject.Find("GameSystems") ?? new GameObject("GameSystems");
        EnsureChild(systems, "GameManager", typeof(GameManager));
        EnsureChild(systems, "UIManager", typeof(UIManager));
        EnsureChild(systems, "PuzzleManager", typeof(PuzzleManager));
        EnsureChild(systems, "ARPlacementManager", typeof(ARPlacementManager));
        EnsureChild(systems, "FirebaseLeaderboard", typeof(FirebaseLeaderboard));

        if (Object.FindObjectOfType<EventSystem>() == null)
        {
            var es = new GameObject("EventSystem");
            es.AddComponent<EventSystem>();
            es.AddComponent<StandaloneInputModule>();
        }

        var canvasGo = GameObject.Find("Canvas_HUD");
        if (canvasGo == null)
        {
            canvasGo = new GameObject("Canvas_HUD");
            var canvas = canvasGo.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = canvasGo.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;
            canvasGo.AddComponent<GraphicRaycaster>();
        }

        EditorSceneManager.MarkSceneDirty(SceneManager.GetActiveScene());
        EditorUtility.DisplayDialog(
            "Augmented Alibi",
            "Hierarchy created.\n\nNext: add AR Session / AR Session Origin from XR menu if missing, then drag prefabs and UI texts into the Inspector slots (see SETUP_INSPECTOR.md).",
            "OK");
    }

    static GameObject EnsureChild(GameObject parent, string name, System.Type component)
    {
        Transform t = parent.transform.Find(name);
        GameObject go = t != null ? t.gameObject : new GameObject(name);
        go.transform.SetParent(parent.transform, false);
        if (go.GetComponent(component) == null)
            go.AddComponent(component);
        return go;
    }
}
#endif

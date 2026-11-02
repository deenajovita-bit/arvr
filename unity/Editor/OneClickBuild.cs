#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.XR.ARFoundation;

/// <summary>
/// Menu: Augmented Alibi → Build Clues (One Click)
/// Drop this file in Assets/Editor. It makes the five clues and connects them.
/// </summary>
public static class OneClickBuild
{
    [MenuItem("Augmented Alibi/Build Clues (One Click)")]
    public static void Build()
    {
        Directory.CreateDirectory("Assets/Prefabs");

        var placement = Object.FindFirstObjectByType<ARPlacementManager>();
        if (placement == null)
        {
            EditorUtility.DisplayDialog("Augmented Alibi", "ARPlacementManager was not found. Use Augmented Alibi → Create ARInvestigation Hierarchy first.", "OK");
            return;
        }

        var ray = Object.FindFirstObjectByType<ARRaycastManager>();
        var plane = Object.FindFirstObjectByType<ARPlaneManager>();
        placement.raycastManager = ray;
        placement.planeManager = plane;

        placement.fingerprintPrefab = MakeClue("Clue_Fingerprint", PrimitiveType.Quad, new Vector3(0.2f, 0.2f, 0.2f), new Vector3(90f, 0f, 0f), new Color(0.15f, 0.75f, 0.85f));
        placement.tornNotePrefab = MakeClue("Clue_TornNote", PrimitiveType.Quad, new Vector3(0.22f, 0.14f, 1f), Vector3.zero, new Color(0.91f, 0.86f, 0.72f));
        placement.footprintsPrefab = MakeClue("Clue_Footprints", PrimitiveType.Cube, new Vector3(0.18f, 0.02f, 0.28f), Vector3.zero, new Color(0.35f, 0.22f, 0.12f));
        placement.watchPrefab = MakeClue("Clue_Watch", PrimitiveType.Cylinder, new Vector3(0.08f, 0.015f, 0.08f), Vector3.zero, new Color(0.75f, 0.75f, 0.78f));
        placement.keyPrefab = MakeClue("Clue_Key", PrimitiveType.Cube, new Vector3(0.12f, 0.02f, 0.04f), Vector3.zero, new Color(0.85f, 0.65f, 0.15f));
        placement.bookshelfTriggerPrefab = MakeShelf();

        FixExtraCamera();
        EditorUtility.SetDirty(placement);
        EditorSceneManager.MarkSceneDirty(SceneManager.GetActiveScene());
        AssetDatabase.SaveAssets();

        EditorUtility.DisplayDialog(
            "Augmented Alibi",
            "Clues are built and connected.\n\nPress the Play button, then click once inside the Game view. The clues appear in front of the camera. Click a clue to collect it.",
            "OK");
    }

    static GameObject MakeClue(string name, PrimitiveType shape, Vector3 scale, Vector3 euler, Color color)
    {
        var go = GameObject.CreatePrimitive(shape);
        go.name = name;
        go.transform.localScale = scale;
        go.transform.eulerAngles = euler;
        var clue = go.AddComponent<ARClue>();
        clue.clueName = name;
        Paint(go, color);

        string path = "Assets/Prefabs/" + name + ".prefab";
        var prefab = PrefabUtility.SaveAsPrefabAsset(go, path);
        Object.DestroyImmediate(go);
        return prefab;
    }

    static GameObject MakeShelf()
    {
        var root = GameObject.CreatePrimitive(PrimitiveType.Cube);
        root.name = "Bookshelf_Interact";
        root.transform.localScale = new Vector3(1.2f, 1.8f, 0.3f);
        Paint(root, new Color(0.28f, 0.16f, 0.08f));

        var closed = GameObject.CreatePrimitive(PrimitiveType.Cube);
        closed.name = "Closed";
        closed.transform.SetParent(root.transform, false);
        closed.transform.localScale = Vector3.one;

        var open = GameObject.CreatePrimitive(PrimitiveType.Cube);
        open.name = "Open";
        open.transform.SetParent(root.transform, false);
        Paint(open, Color.black);
        open.SetActive(false);

        var book = GameObject.CreatePrimitive(PrimitiveType.Cube);
        book.name = "GlowBook";
        book.transform.SetParent(root.transform, false);
        book.transform.localScale = new Vector3(0.08f, 0.25f, 0.2f);
        book.transform.localPosition = new Vector3(0.2f, 0.1f, -0.6f);
        Paint(book, new Color(0.1f, 0.8f, 0.9f));
        book.SetActive(false);

        var trigger = root.AddComponent<BookshelfTrigger>();
        trigger.closedBookshelf = closed;
        trigger.openBookshelf = open;
        trigger.glowingBook = book;
        trigger.requiredClue = "Torn Note";

        string path = "Assets/Prefabs/Bookshelf_Interact.prefab";
        var prefab = PrefabUtility.SaveAsPrefabAsset(root, path);
        Object.DestroyImmediate(root);
        return prefab;
    }

    static void Paint(GameObject go, Color color)
    {
        var renderer = go.GetComponent<Renderer>();
        if (renderer == null) return;
        var shader = Shader.Find("Universal Render Pipeline/Lit");
        if (shader == null) shader = Shader.Find("Standard");
        var mat = new Material(shader);
        mat.color = color;
        renderer.sharedMaterial = mat;
    }

    static void FixExtraCamera()
    {
        var cameras = Object.FindObjectsByType<Camera>(FindObjectsInactive.Include, FindObjectsSortMode.None);
        foreach (var cam in cameras)
        {
            bool keep = cam.transform.parent != null && cam.transform.parent.name == "Camera Offset";
            if (keep)
            {
                cam.tag = "MainCamera";
                cam.gameObject.SetActive(true);
            }
            else if (cam.CompareTag("MainCamera"))
            {
                cam.tag = "Untagged";
                cam.gameObject.SetActive(false);
            }
        }
    }
}
#endif

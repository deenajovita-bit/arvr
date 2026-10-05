using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using UnityEngine.EventSystems;

public class ARPlacementManager : MonoBehaviour
{
    [Header("AR Components")]
    public ARRaycastManager raycastManager;
    public ARPlaneManager planeManager;

    [Header("Clue Prefabs")]
    public GameObject fingerprintPrefab;
    public GameObject tornNotePrefab;
    public GameObject footprintsPrefab;
    public GameObject watchPrefab;
    public GameObject keyPrefab;
    public GameObject bookshelfTriggerPrefab; // Special interactive object

    [Header("Settings")]
    public bool autoPlaceOnStart = false;
    public int maxPlanesToUse = 5;

    private List<ARRaycastHit> hits = new List<ARRaycastHit>();
    private List<GameObject> placedClues = new List<GameObject>();
    private bool cluesPlaced = false;

    void Start()
    {
        if (raycastManager == null)
            raycastManager = FindObjectOfType<ARRaycastManager>();
        if (planeManager == null)
            planeManager = FindObjectOfType<ARPlaneManager>();
    }

    void Update()
    {
        // For prototyping: place all clues when user taps a plane the first time
        if (!cluesPlaced && Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            if (touch.phase == TouchPhase.Began && !IsPointerOverUI())
            {
                if (raycastManager.Raycast(touch.position, hits, TrackableType.PlaneWithinPolygon))
                {
                    PlaceAllClues(hits[0].pose);
                    cluesPlaced = true;
                }
            }
        }

        #if UNITY_EDITOR
        // Mouse support for testing in Editor
        if (!cluesPlaced && Input.GetMouseButtonDown(0) && !IsPointerOverUI())
        {
            if (raycastManager != null && raycastManager.Raycast(Input.mousePosition, hits, TrackableType.PlaneWithinPolygon))
            {
                PlaceAllClues(hits[0].pose);
                cluesPlaced = true;
            }
            else
            {
                // Fallback for editor without real AR
                PlaceAllClues(new Pose(new Vector3(0, 0, 1.5f), Quaternion.identity));
                cluesPlaced = true;
            }
        }
        #endif
    }

    void PlaceAllClues(Pose basePose)
    {
        // Place clues relative to the first detected plane
        // In a real production version you would scatter them more intelligently
        // or use pre-defined offsets / multiple planes

        Vector3 origin = basePose.position;

        // Fingerprint near the "table" area
        SpawnClue(fingerprintPrefab, origin + new Vector3(0.3f, 0.02f, 0.2f), "Fingerprint", 100);

        // Torn Note a bit further
        SpawnClue(tornNotePrefab, origin + new Vector3(-0.4f, 0.02f, 0.5f), "Torn Note", 150);

        // Footprints leading away
        SpawnClue(footprintsPrefab, origin + new Vector3(0.1f, 0.01f, 0.8f), "Footprints", 100);

        // Broken Watch near the "passage"
        SpawnClue(watchPrefab, origin + new Vector3(0.6f, 0.02f, 1.2f), "Broken Watch", 300);

        // Key (after passage is found)
        SpawnClue(keyPrefab, origin + new Vector3(0.7f, 0.05f, 1.4f), "Hidden Key", 200);

        // Bookshelf trigger (larger interactive object)
        if (bookshelfTriggerPrefab != null)
        {
            GameObject shelf = Instantiate(bookshelfTriggerPrefab, origin + new Vector3(0, 0, 1.5f), Quaternion.identity);
            placedClues.Add(shelf);
        }

        Debug.Log("All AR clues placed relative to detected plane.");
    }

    void SpawnClue(GameObject prefab, Vector3 position, string name, int points)
    {
        if (prefab == null) return;

        GameObject obj = Instantiate(prefab, position, Quaternion.identity);
        ARClue clueScript = obj.GetComponent<ARClue>();
        if (clueScript != null)
        {
            clueScript.clueName = name;
            clueScript.points = points;
        }
        placedClues.Add(obj);
    }

    bool IsPointerOverUI()
    {
        return EventSystem.current != null && EventSystem.current.IsPointerOverGameObject();
    }

    // Call this from a UI button if you want to reset placement
    public void ResetClues()
    {
        foreach (var c in placedClues)
        {
            if (c != null) Destroy(c);
        }
        placedClues.Clear();
        cluesPlaced = false;
    }
}

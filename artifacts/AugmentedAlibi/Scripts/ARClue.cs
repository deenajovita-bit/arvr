using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

public class ARClue : MonoBehaviour
{
    [Header("Clue Settings")]
    public string clueName = "Fingerprint";
    public int points = 100;
    public bool isCollected = false;
    public GameObject visualObject;          // The 3D model or particle that appears
    public GameObject collectedEffect;       // Optional particle when collected

    [Header("Interaction")]
    public float interactionDistance = 1.5f;
    public bool requireTap = true;

    private Camera arCamera;
    private bool playerInRange = false;

    void Start()
    {
        arCamera = Camera.main;
        if (visualObject != null)
            visualObject.SetActive(false); // Hidden until discovered or always visible depending on design
    }

    void Update()
    {
        if (isCollected || GameManager.Instance == null || GameManager.Instance.gameOver) return;

        // Simple distance check (works even without full plane tracking for prototyping)
        if (arCamera != null)
        {
            float dist = Vector3.Distance(transform.position, arCamera.transform.position);
            playerInRange = dist < interactionDistance;

            // Make it glow or become visible when close
            if (visualObject != null && !visualObject.activeSelf && playerInRange)
            {
                visualObject.SetActive(true);
            }
        }

        // Tap to collect
        if (requireTap && playerInRange && Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            if (touch.phase == TouchPhase.Began)
            {
                Ray ray = arCamera.ScreenPointToRay(touch.position);
                RaycastHit hit;
                if (Physics.Raycast(ray, out hit))
                {
                    if (hit.transform == transform || hit.transform.IsChildOf(transform))
                    {
                        Collect();
                    }
                }
            }
        }

        // Also allow mouse click for editor testing
        #if UNITY_EDITOR
        if (requireTap && playerInRange && Input.GetMouseButtonDown(0))
        {
            Ray ray = arCamera.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            if (Physics.Raycast(ray, out hit))
            {
                if (hit.transform == transform || hit.transform.IsChildOf(transform))
                {
                    Collect();
                }
            }
        }
        #endif
    }

    public void Collect()
    {
        if (isCollected) return;

        isCollected = true;
        GameManager.Instance.CollectEvidence(clueName, points);

        if (collectedEffect != null)
        {
            Instantiate(collectedEffect, transform.position, Quaternion.identity);
        }

        // Hide or play animation
        if (visualObject != null)
        {
            // Simple fade or just disable
            visualObject.SetActive(false);
        }

        // Optional: destroy after short delay
        Destroy(gameObject, 1.5f);
    }

    // Called by ARRaycast or placement system when this clue is spawned on a plane
    public void PlaceOnSurface(Pose pose)
    {
        transform.position = pose.position;
        transform.rotation = pose.rotation;
        if (visualObject != null) visualObject.SetActive(true);
    }
}

using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

public class ARClue : MonoBehaviour
{
    [Header("Clue Settings")]
    public string clueName = "Fingerprint";
    public int points = 100;
    public bool isCollected = false;
    public GameObject visualObject;
    public GameObject collectedEffect;

    [Header("Interaction")]
    public float interactionDistance = 1.5f;
    public bool requireTap = true;

    private Camera arCamera;
    private bool playerInRange = false;

    void Start()
    {
        arCamera = Camera.main;
        if (visualObject != null)
            visualObject.SetActive(false);
    }

    void Update()
    {
        if (isCollected || GameManager.Instance == null || GameManager.Instance.gameOver) return;

        if (arCamera != null)
        {
            float dist = Vector3.Distance(transform.position, arCamera.transform.position);
            playerInRange = dist < interactionDistance;

            if (visualObject != null && !visualObject.activeSelf && playerInRange)
            {
                visualObject.SetActive(true);
            }
        }

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

        if (visualObject != null)
        {
            visualObject.SetActive(false);
        }

        Destroy(gameObject, 1.5f);
    }

    public void PlaceOnSurface(Pose pose)
    {
        transform.position = pose.position;
        transform.rotation = pose.rotation;
        if (visualObject != null) visualObject.SetActive(true);
    }
}

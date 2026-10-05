using UnityEngine;

public class BookshelfTrigger : MonoBehaviour
{
    [Header("Bookshelf Settings")]
    public GameObject closedBookshelf;
    public GameObject openBookshelf;          // The version with passage revealed
    public GameObject glowingBook;            // The book that glows
    public ParticleSystem openEffect;

    public string requiredClue = "Torn Note"; // Must have this evidence first
    public int points = 300;

    private bool isOpened = false;
    private bool isGlowing = false;

    void Start()
    {
        if (openBookshelf) openBookshelf.SetActive(false);
        if (glowingBook) glowingBook.SetActive(false);
    }

    void Update()
    {
        if (isOpened) return;

        // Simple proximity glow
        if (Camera.main != null)
        {
            float dist = Vector3.Distance(transform.position, Camera.main.transform.position);
            if (dist < 2.0f && !isGlowing)
            {
                isGlowing = true;
                if (glowingBook) glowingBook.SetActive(true);
            }
        }

        // Tap interaction
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            if (touch.phase == TouchPhase.Began)
            {
                Ray ray = Camera.main.ScreenPointToRay(touch.position);
                RaycastHit hit;
                if (Physics.Raycast(ray, out hit) && hit.transform == transform)
                {
                    TryOpen();
                }
            }
        }

        #if UNITY_EDITOR
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            if (Physics.Raycast(ray, out hit) && hit.transform == transform)
            {
                TryOpen();
            }
        }
        #endif
    }

    void TryOpen()
    {
        if (isOpened) return;

        // Check if player has the required clue
        if (GameManager.Instance != null && 
            GameManager.Instance.collectedEvidence.Contains(requiredClue))
        {
            OpenPassage();
        }
        else
        {
            UIManager.Instance?.ShowNotification("You need more clues to understand this bookshelf...");
        }
    }

    void OpenPassage()
    {
        isOpened = true;

        if (closedBookshelf) closedBookshelf.SetActive(false);
        if (openBookshelf) openBookshelf.SetActive(true);
        if (glowingBook) glowingBook.SetActive(false);

        if (openEffect) openEffect.Play();

        GameManager.Instance.CollectEvidence("Secret Passage", points);
        UIManager.Instance?.ShowNotification("SECRET PASSAGE DISCOVERED!");
    }
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GoalArea : MonoBehaviour
{
    public static bool goal;
    // Start is called before the first frame update
    void Start()
    {
        goal = false;
    }

    private void OnTriggerEnter(Collider col)
    {
        if (col.gameObject.tag == "Player")
        {
            goal = true;
        }
    }
}

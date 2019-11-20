﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DeathZone : MonoBehaviour
{
    public static bool dead;
    // Start is called before the first frame update
    void Start()
    {
        dead = false;
    }

    private void OnTriggerEnter(Collider col)
    {
        if(col.gameObject.tag == "Hiyoko")
        {
            UIController.gameOver = true;
            dead = true;
        }
    }
}

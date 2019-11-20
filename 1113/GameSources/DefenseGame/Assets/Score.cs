using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Score : MonoBehaviour
{
    public static int score;
    private Text text;
    void Start()
    {
        text = GetComponent<Text>();        
    }

    // Update is called once per frame
    void Update()
    {
        text.text = "Score: " + score.ToString();
    }
}

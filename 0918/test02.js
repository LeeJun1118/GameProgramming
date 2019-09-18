alert("자바 스크립트 대화상자");


document.writeln();
for(var i = 2; i < 10; i++)
{
    document.writeln("<br><br>" +i + "단    <br><br>")
    for (var j  = 1; j < 10; j ++)
    {
        document.writeln(i + "x" +j + " = " + i * j + "<br>");
    }
    document.writeln("");

}
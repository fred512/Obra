<?php

$conn = new COM ("ADODB.Connection") or die ("Impossível iniciar ADO");

//Conexao Casa
//$conn->Open("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:\Avaliacao\avaliacao.mdb");
//echo "<script>alert('$login');</script>";

//Conexao CEF
$conn->Open("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=..\Avaliacao\_db\avaliacao.mdb");
$user = $_SERVER['LOGON_USER'];
$login = substr($user, 10, 7);
?>

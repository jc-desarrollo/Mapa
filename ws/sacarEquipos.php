<?php
$hostBd = 'localhost';
$nombreBd = 'transbetxi';
$usuarioBd = 'mytransbet0b';
$passwordBd = 'EFx4KuJo';

try {
    $pdo = new PDO("mysql:host=$hostBd;dbname=$nombreBd;charset=utf8", $usuarioBd, $passwordBd);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Error: ' . $e->getMessage());
}

$sql = $pdo->prepare("SELECT id, nombreEquipo FROM ubicacion");

if (!$sql) {
    die('Error en la preparación de la consulta.');
}

if (!$sql->execute()) {
    die('Error al ejecutar la consulta.');
}

$sql->setFetchMode(PDO::FETCH_ASSOC);
header("HTTP/1.1 200 OK");
$results = $sql->fetchAll();

if ($results === false) {
    die('Error al obtener los resultados.');
}

echo json_encode($results);
exit;
?>

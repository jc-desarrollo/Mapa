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

if ($_SERVER['REQUEST_METHOD'] == 'GET' && $_SERVER['HTTP_CODE'] === 'pass23sd2aASED6') {
    // Recibir los equipos seleccionados como una cadena separada por comas
    $equiposSeleccionados = isset($_GET['equipos']) ? explode(',', $_GET['equipos']) : [];

    $query = "SELECT * FROM ubicacion";
    if (!empty($equiposSeleccionados)) {
        $inQuery = implode(',', array_fill(0, count($equiposSeleccionados), '?'));
        $query .= " WHERE nombreEquipo IN ($inQuery)";
    }

    $sql = $pdo->prepare($query);

    if (!$sql) {
        die('Error en la preparación de la consulta.');
    }

    if (!empty($equiposSeleccionados)) {
        if (!$sql->execute($equiposSeleccionados)) {
            die('Error al ejecutar la consulta.');
        }
    } else {
        if (!$sql->execute()) {
            die('Error al ejecutar la consulta.');
        }
    }

    $sql->setFetchMode(PDO::FETCH_ASSOC);
    header("HTTP/1.1 200 OK");
    $results = $sql->fetchAll();

    if ($results === false) {
        die('Error al obtener los resultados.');
    }

    echo json_encode($results);
    exit;
}
?>

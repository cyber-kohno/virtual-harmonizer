<?php

$json_string = file_get_contents('php://input');
$param = json_decode($json_string, true);
$database = $param['database'];
$type = $param['type'];
$sql = $param['sql'];

try {
    header("Content-Type: application/json; charset=UTF-8");
    // 接続
    $pdo = new PDO('sqlite:'. $database);

    // SQL実行時にもエラーの代わりに例外を投げるように設定
    // (毎回if文を書く必要がなくなる)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // デフォルトのフェッチモードを連想配列形式に設定 
    // (毎回PDO::FETCH_ASSOCを指定する必要が無くなる)
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

// 選択 (プリペアドステートメント)
    //$sql = $_POST['sql'];
    //$sql = 'SELECT * FROM tblcol where テーブルＩＤ like ?';
    $stmt = $pdo->prepare($sql);

    if($type == 'select') {
        find($stmt);
    } else {

    }
} catch (Exception $e) {

    echo $e->getMessage() . PHP_EOL;

}

function find($stmt) {
    //$stmt->execute(['gaksetbl']);
    $stmt->execute();
    $r1 = $stmt->fetchAll();

    $list = array();
    // 取得したデータを出力
    foreach($r1 as $value ) {
        $json = array();
        for ($i = 0; $i < $stmt->columnCount(); $i++) {
          $name = $stmt->getColumnMeta($i)['name'];
          $json += array($name=>$value[$name]);
        }

        //$json += array('tbl_def'=>$value["tbl_def"]);
        //$json += array('tbl_nam'=>$value["tbl_nam"]);
        array_push($list, $json);
	//echo $value["tbl_def"]."====".$value["tbl_nam"]."<br>";
    }
    echo json_encode($list);
    //echo $list;
}

?>
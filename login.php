<!--http://localhost/mygame/login.php?page=gamestart -->
<?php
$page=$_GET["page"]??"login";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- クリック -->
    <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <!-- メインタイトル -->
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Nosifer&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <?php if($page==="login"):?>
        <div onclick="location.href='?page=gamestart'" class="startgame">
            <p>???</p>
        </div>
    <?php elseif($page==="gamestart"):?>
        <div class="wrapper">
            <h1>Welcome</h1>
            <form method="POST">
               <div class="input-box">
                <input type="text" placeholder="username" required>
               </div>

               <div class="input-box">
                <input type="text" placeholder="password" required>
               </div>

               <button type="submit" class="btn">login</button>
            </form>
        </div>
    <?php else: ?>
        <div style="color:white; padding:40px;">ページが見つかりません</div>
    <?php endif; ?>
</body>
</html>

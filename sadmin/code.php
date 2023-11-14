<?php
    session_start();
    error_reporting(E_ALL);
    function colorHexToDec( $color ) {
        if( substr( $color, 0, 1 ) == '#' ) $color = substr( $color, 1 );
        $red = @substr( $color, 0, 2 );
        $green = @substr( $color, 2 ,2 );
        $blue = @substr( $color, 4, 2 );
        return array(
            'red' => hexdec( $red ),
            'green' => hexdec( $green ),
            'blue' => hexdec( $blue )
        );
    }
    function random_string($type = 'alnum', $len = 5){
        switch($type){
            case 'alnum'    :
            case 'numeric'  :
            case 'nozero'   :
                switch ($type){
                    case 'alnum'    :   $pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                        break;
                    case 'numeric'  :   $pool = '0123456789';
                        break;
                    case 'nozero'   :   $pool = '123456789';
                        break;
                }

                $str = '';
                for ($i=0; $i < $len; $i++){
                    $str .= substr($pool, mt_rand(0, strlen($pool) -1), 1);
                }
                return $str;
              break;
            case 'unique' : return md5(uniqid(mt_rand()));
              break;
        }
    }

    $width = 60;
    $height = 24;

    $my_image = imagecreatetruecolor($width, $height);
    imagefill($my_image, 0, 0, 0xDFE8F6);

    // add noise
    for ($c = 0; $c < 50; $c++){
        $x = rand(0,$width-1);
        $y = rand(0,$height-1);
        imagesetpixel($my_image, $x, $y, 0x000000);
        $x = rand(0,$width-3);
        $y = rand(0,$height-3);
        imagesetpixel($my_image, $x, $y, 0x808000);

    }

    //add lines
    $lineAlpha = 10;
    $alpha = floor( $lineAlpha / 100 * 127 );

    $lineDistance = 8;
    $lineColor = 'A1BCDF';
    $temp = colorHexToDec( $lineColor );
    $linecolor = imagecolorallocatealpha( $my_image, $temp['red'], $temp['green'], $temp['blue'], $alpha );
    for ( $x1 = -( $height ); $x1 < $width; $x1 += rand( 1, $lineDistance ) ) {
            imageline( $my_image, $x1, 0, $x1 + $height, $height, $linecolor );
    }
    for ( $x1 = $width + $height; $x1 > 0; $x1 -= rand( 1, $lineDistance ) ) {
            imageline( $my_image, $x1, 0, $x1 - $height, $height, $linecolor );
    }


    //Generate code to show
    $x = rand(1,10);
    $y = rand(1,10);
	$rand_string = rand(10000,99999);

    /*
    $x = 10;
    $y = 5;
    $rand_string = random_string();
    */
	//$rand_string = random_string();
	
    imagestring($my_image, 5, $x, $y, $rand_string, 0x000000);

    $_SESSION['secureCode'] = md5($rand_string).'jlp';

    header( "Expires: Fri, 27 Jul 1973 01:30:00 GMT" );
    header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
    header( "Cache-Control: no-store, no-cache, must-revalidate" );
    header( "Cache-Control: post-check=0, pre-check=0", false );
    header( "Pragma: no-cache" );
    header( "Content-Type: image/jpeg" );

//    header('Content-type: image/jpeg');
    imagejpeg($my_image);
    imagedestroy($my_image);
?>

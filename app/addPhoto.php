<?php
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	
	
	$imgName = $_SERVER['DOCUMENT_ROOT'] . '/uploads/' . $request->img;
	$albumUrl = "https://picasaweb.google.com/data/feed/api/user/" . $request->autorId . "/albumid/" . $request->albumId . "?" . "access_token=" . $request->token;
	
	
	//Get the binary image data
	$fileSize = filesize($imgName);
	$fh = fopen($imgName, 'rb');
	$imgData = fread($fh, $fileSize);
	fclose($fh);
	
	
	$header = array('GData-Version:  2', 'Content-Type: image/jpeg', 'Content-Length: ' . $fileSize, 'Slug:' . $request->img);
	$data = $imgData; //Make sure the image data is NOT Base64 encoded otherwise the upload will fail with a "Not an image" error

	$ret = "";	
	$ch  = curl_init($albumUrl);
	$options = array(
        CURLOPT_SSL_VERIFYPEER=> false,
        CURLOPT_POST=> true,
        CURLOPT_RETURNTRANSFER=> true,
        CURLOPT_HEADER=> true,
        CURLOPT_FOLLOWLOCATION=> true,
        CURLOPT_POSTFIELDS=> $data,
        CURLOPT_HTTPHEADER=> $header
    );
	curl_setopt_array($ch, $options);
	$ret = curl_exec($ch);
	
	if($ret !== FALSE) {
		
			if (!unlink($imgName))
		{
			echo ("Error deleting $file");
			}
			else
		{
			echo ("Deleted $file");
			}
			//----------обработку ошибок добавить
		$xmlO = simplexml_load_string($ret );
				echo $xmlO ;
	}

curl_close($ch);
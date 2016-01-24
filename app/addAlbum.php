<?php
	
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	//echo $request->title . " 1 " . $request->access . "  2" . $request->token . " 3 " . $request->description;
	//------------xml-template--------------------------
	$xml_data = "<entry xmlns='http://www.w3.org/2005/Atom'
                xmlns:media='http://search.yahoo.com/mrss/'
                xmlns:gphoto='http://schemas.google.com/photos/2007'>
				<title type='text'>" . $request->title
				."</title><summary type='text'>" . $request->description
				."</summary><gphoto:location>" . "Louisville"
				."</gphoto:location><gphoto:access>" . $request->access
				."</gphoto:access><gphoto:timestamp>1152255600000
				</gphoto:timestamp><category scheme='http://schemas.google.com/g/2005#kind'
                term='http://schemas.google.com/photos/2007#album'></category>
				</entry>";
	
		
	$url = "https://picasaweb.google.com/data/feed/api/user/" . $request->autorId .  "?" . "access_token=" . $request->token;
	
	
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_MUTE, 1);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_POST, 1);
		 
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('GData-Version:  2', 'Content-Type: application/atom+xml'));
		curl_setopt($ch, CURLOPT_POSTFIELDS, "$xml_data");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$output = curl_exec($ch);
		$info = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			if($result !== FALSE) {
			//echo"sada " . $info. "   " . $output;
			//----------обработку ошибок добавить
			$xmlO = simplexml_load_string($output);
				echo json_encode($xmlO);
			}
		curl_close($ch);
		
?>
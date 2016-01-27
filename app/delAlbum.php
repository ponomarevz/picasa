<?php
	
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	
	$url = "https://picasaweb.google.com/data/entry/api/user/" . $request->autorId . "/albumid/" . $request->albumId  .  "?access_token=" . $request->token;
	// "/1?alt=json" . "&"
		//$xml_data = '<link rel="edit">';
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_MUTE, 1);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
		 
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('GData-Version:  2', 'Content-Type: application/atom+xml', 'If-Match: *'));
		//curl_setopt($ch, CURLOPT_POSTFIELDS, "$xml_data");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$output = curl_exec($ch);
		$info = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		echo $info;
			
		curl_close($ch);
		
?>
<?php

/** __________________   */
$msg = $_POST['message'];
$banner = "https://maxtvcommunications.com/assets/img/banner_top.jpg";

$html = "
<table style=\"max-width: 800px; margin: auto;\">
	<tr>
		<td><img src=\"$banner\" style=\"width: 100%; height: auto;\"></td>
	</tr>
	<tr><td>$msg</td></tr>
</table>";
/** __________________   */

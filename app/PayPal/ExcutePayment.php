<?php

namespace PayPal;
use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;

$config = [
    "id"  => "AYfR2ytBTo3K31b0hV7lIC3ioXz6cTuZusjKQE5XUVtyZ8E1FXikRuNQBVZfKpnqCE7Q-Jjza2y1F24c",
    "secrete" => "EJFiXlkNOhlt3uokThwW8VOAe4S7DE_GaeEuEXZcx2hWYYx1RbNHSINVLpBok3QIft8Csf1V8vk2tt2_"
];
$apiContext = new ApiContext(
   new \PayPal\Auth\OAuthTokenCredential(
       $config['id'],
       $config['secrete']
   )
);

if (isset($_GET['success']))
{
    $var = $_GET['success'];
    $paymentID = $_GET['paymentId'];
    $payment = Payment::get($paymentID, $apiContext);

}
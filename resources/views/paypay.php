              <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
                </head>
                
                <body>
                
                  <script>
                      paypal.Buttons().render('#paypal-button-container');
                      // This function displays Smart Payment Buttons on your web page.
                    </script>
                  <script
                    src="https://www.paypal.com/sdk/js?client-id=SB_CLIENT_ID"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
                  </script>
                </body>
        public function payment(Request $request)
            {
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
                $payment = new \PayPal\Api\Payment();
                $payment->setIntent('sale');
                $redirectUrls = (new  \PayPal\Api\RedirectUrls()) 
                ->setReturnUrl('http://localhost/samakeurback/public/success.php')
                ->setCancelUrl('http://localhost/samakeurback/public/');
                $payment->setRedirectUrls($redirectUrls);
                
        //      On definie le payeur
                $payment->setPayer((new \PayPal\Api\Payer())
                    ->setPaymentMethod('paypal'));
                    $projet = Projet::find(2);
                    $list = new \PayPal\Api\ItemList();
                    $item_payment =  array();
                    $item = (new \PayPal\Api\Item())
                    ->setName($projet->name)
                    ->setPrice(10000)
                    ->setQuantity(1)
                    ->setCurrency('EUR')
                    ;
                    
                    $list->addItem($item);
                    $details =  (new \PayPal\Api\Details())
                          ->setSubTotal(10000);
                          
                    $amount = (new \PayPal\Api\Amount())
                      ->setTotal(10000)
                      ->setCurrency("EUR")
                      ->setDetails($details);
                    
                      $transactions = (new \PayPal\Api\Transaction())
                          ->setItemList($list)
                          ->setDescription("Payment des frais pour le projet")
                          ->setInvoiceNumber(uniqid())
                          ->setAmount($amount)
                          ->setCustom($projet->id);
                        //    dd($transactions);
                          $payment->setTransactions($transactions);

                          try{
                            $payment->create($apiContext);
                            header('Location:'. $payment->getApprovalLink());
                          }
                          catch(\PayPal\Exception\PayPalConnectionException $e)
                          {
                              var_dump(json_decode($e->getData()));
                          }
            
            }
        Hi guys i have had a problem for days
        When I try to call the PayPal API its gives me this error "Incoming JSON request does not map to API reques" with this Error type MALFORMED_REQUEST
        Please need help
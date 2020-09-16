
        var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
        var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        var deck = new Array();   // taken an empty array to push the deck in it
        var players = new Array();  // taken an empty array to push the no. of players
        var currentPlayer = 0;

        function createDeck() // to creat a deck of playing card
        {
            deck = new Array();
            for (var i = 0 ; i < values.length; i++)
            {
                for(var x = 0; x < suits.length; x++)
                {
                    var weight = parseInt(values[i]);  // for returning a whole no.
                    if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                        weight = 10;
                    if (values[i] == "A")   // assining the weight according to their values
                        weight = 11;
                    var card = { Value: values[i], Suit: suits[x], Weight: weight };
                    deck.push(card);   //adding the data  into the deck array
                }
            }
        }

        function createPlayers(num) // to create the players num parameter is taken to give the value 
        {
            players = new Array();
            for(var i = 1; i <= num; i++)  // loop tp create players
            {
                var hand = new Array();
                var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand }; // object giving the info. of players
                players.push(player);  // pushing the object in that empty array
            }
        }

        function createPlayersUI()
        {
            document.getElementById('players').innerHTML = " ";  // to create the interface of players
            for(var i = 0; i < players.length; i++)
            {
                var div_player = document.createElement('div');
                var div_playerid = document.createElement('div');
                var div_hand = document.createElement('div');    // creating new div element
                var div_points = document.createElement('div');

                div_points.className = 'points';
                div_points.id = 'points_' + i;
                div_player.id = 'player_' + i;  // assining the id & class to the new element
                div_player.className = 'player';
                div_hand.id = 'hand_' + i;
                div_playerid.className = 'playerid';

                div_playerid.innerHTML = 'Player ' + players[i].ID;
                div_player.appendChild(div_playerid);
                div_player.appendChild(div_hand);   // appending the new element into one element
                div_player.appendChild(div_points);
                document.getElementById('players').appendChild(div_player); // targeting players element and appending the new element into it 
            }
        }

        function shuffle()
        {
            // for 1000 turns
            for (var i = 0; i < 1000; i++)  //loop for shuffling the deck
            {
                var location1 = Math.floor((Math.random() * deck.length)); 
                var location2 = Math.floor((Math.random() * deck.length));  // generating a random no.
                var tmp = deck[location1];

                deck[location1] = deck[location2];  // a random no. between 0-51 is generated and two card positions are swapped
                deck[location2] = tmp;
            }
        }

        function startblackjack()
        {
            document.getElementById('btnStart').value = 'Restart'; //changing the value of start button
            document.getElementById("status").style.display="none"; // inserting the css style to the status element
            // deal 2 cards to every player object
            currentPlayer = 0;
            createDeck();
            shuffle();
        // createPlayers();
            createPlayersUI();
            dealHands();
            document.getElementById('player_' + currentPlayer).classList.add('active'); //adding a class to the player element
        }

        function dealHands()
        {
            // alternate handing cards to each player
            // 2 cards each
            for(var i = 0; i < 2; i++)
            {
                for (var x = 0; x < players.length; x++)
                {
                    var card = deck.pop(); // taking out the card from the deck
                    players[x].Hand.push(card);  // pushing the card to player hand from the deck 
                    renderCard(card, x);
                    updatePoints(); // updating the points according the value of the drawn card
                }
            }

            updateDeck();
        }

        function renderCard(card, player)
        {
            var hand = document.getElementById('hand_' + player);
            hand.appendChild(getCardUI(card));   // card interface that is in hand of player
        }

        function getCardUI(card)
        {  // to create the interface of the card according to the suits&values
            var el = document.createElement('div');   
            var icon = '';                           
            if (card.Suit == 'Hearts')
            icon='&hearts;';
            else if (card.Suit == 'Spades')    // assingning the icon of card according to the suit 
            icon = '&spades;';
            else if (card.Suit == 'Diamonds')
            icon = '&diams;';
            else
            icon = '&clubs;';
            
            el.className = 'card';
            el.innerHTML = card.Value + '<br/>' + icon;   // now card in the player hand will show the suit&value
            return el;
        }

        // returns the number of points that a player has in hand
        function getPoints(player)
        {
            var points = 0;
            for(var i = 0; i < players[player].Hand.length; i++)
            {
                points += players[player].Hand[i].Weight;
            }
            players[player].Points = points;
            return points;
        }

        function updatePoints()
        {
            for (var i = 0 ; i < players.length; i++) // to update the points when a player draws more card from the deck
            {
                getPoints(i);
                document.getElementById('points_' + i).innerHTML = players[i].Points;
            }
        }

        function hitMe()
        {
            // pop a card from the deck to the current player
            // check if current player new points are over 21
            var card = deck.pop();
            players[currentPlayer].Hand.push(card);
            renderCard(card, currentPlayer);
            updatePoints();
            updateDeck();
            check();
        }

        function stay()
        {
            // move on to next player, if any
            if (currentPlayer != players.length-1) {
                document.getElementById('player_' + currentPlayer).classList.remove('active');
                currentPlayer += 1;
                document.getElementById('player_' + currentPlayer).classList.add('active');
            }

            else {
                end();
            }
        }

        function end()
        {
            var winner = -1;
            var score = 0;

            for(var i = 0; i < players.length; i++)
            {
                if (players[i].Points > score && players[i].Points < 22)
                {
                    winner = i;
                }

                score = players[i].Points;
            }
    
          // document.getElementById('instruction').innerHTML = "<h3>Instruction<h3/>";
          // document.getElementById('instruction').innerHTML = "<p>To Play Again<p/>";
            document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
            document.getElementById("status").style.display = "inline-block";
        }

        function check()
        {
            if (players[currentPlayer].Points > 21) //to check the points if it will be greater than 21 then lost
            {
                document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
                document.getElementById('status').style.display = "inline-block";
                end();
            }
        }

        function updateDeck()
        {
            document.getElementById('deckcount').innerHTML= deck.length; // update the deck after every card drawn
        }

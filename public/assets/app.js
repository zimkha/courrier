var BASE_URL='//'+location.host+'/pharmacie/public/';

$(document).ready(function() {
    $.ajax({
        url: 'http://' + location.host + '/pharmacie/public/caisse/statistique/week/2',
        method: "GET",
        success: function (data) {
            console.log(data);

            var jour = [];
            var montant = [];


            for (var i in data) {
                if (data[i].montant != null) {
                    jour.push('' + data[i].day);
                    montant.push(data[i].montant);

                }
            }
            var chardata = {
                labels: jour,
                datasets: [
                    {
                        label: 'Statistiques sur le montant des ventes par Semaine ',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(200,200,200,1)',
                        hoverBorderColor: 'rgba(200,200,200,1)',
                        data: montant
                    }
                ]
            };
            var ctx1 = $("#caisseWeek");
            var barGraph1 = new Chart(ctx1, {
                type: 'bar',
                data: chardata,
                options: {
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255, 99, 132)',
                            fontFamily: 'Helvetica Neue',
                            padding: 10,
                        }
                    },
                    tooltips: {
                        callbacks: {
                            labelColor: function(tooltipItem, chart) {
                                return {
                                    borderColor: 'rgb(255, 0, 0)',
                                    backgroundColor: 'rgb(255, 0, 0)'
                                };
                            },
                            labelTextColor: function(tooltipItem, chart) {
                                return '#ffffff';
                            }
                        }
                    }

                }
            });
        }, error: function (data) {
            console.log(data)
        }
        });

});


 <?php

use Illuminate\Database\Seeder;
use App\ServiceGauche;
use App\ServiceDroite;
class DatabaseTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $droite = [
            array('name' => "DA"),
            array('name' => "Conseiller"),
            array('name' => 'Assistante Particulier' ),
            array('name' => 'Coord USSEIN' ),
            array('name' => 'Coord Particulier' ),
            array('name' => 'Assistante UAM' ),
            array('name' => 'Cellule Com' ),
            array('name' => 'Cellule Audit et Controler' ),
            array('name' => 'Cellule Suivi' ),
            array('name' => 'Cellule Juridique' ),
            array('name' => 'Cellule Passation des Marches' ),
            array('name' => 'Cellule Cooperation' ),
            array('name' => 'Unite de Securite' ),
            array('name' => 'Charge de mission' ),
            array('name' => 'BAD' ),
            array('name' => 'BC' ),
        ];

        $gauche = [
          array('name' => "CSA"),
          array('name' => "AC"),
          array('name' => 'DCH' ),
          array('name' => 'DMG' ),
          array('name' => 'DSAS' ),
          array('name' => 'DRU' ),
          array('name' => 'DCU' ),
          array('name' => 'DACS' ),
          array('name' => 'DE' ),
          array('name' => 'DI' ),
          array('name' => 'DST' ),
          array('name' => 'DB' ),
          array('name' => 'CPM' ),
          array('name' => 'CCOOP' ),
          array('name' => 'BAP' ),
      ];

        foreach ($gauche as $type) {
            $item = ServiceGauche::where('name', 'like', '%'.$type['name'].'%');
            if (!isset($item)) {
              $item = new ServiceGauche();
              $item->name = $type['name'];
              $item->save();
            }
        }

        foreach ($droite as $type) {
          $item = ServiceDroite::where('name', 'like', '%'.$type['name'].'%');
          if (!isset($item)) {
            $item = new ServiceGauche();
            $item->name = $type['name'];
            $item->save();          }
      }
  
    }
}

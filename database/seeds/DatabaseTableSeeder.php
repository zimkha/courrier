 <?php

use Illuminate\Database\Seeder;
use App\TypeRemarque;
use App\UniteMesure;
class DatabaseTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $type_remarques = [
            array('name' => "Ajout sur le projet"),
            array('name' => "Modification du projet"),
            array('name' => 'Suppression sur le plan' )
        ];

        foreach ($type_remarques as $type) {
            $item = TypeRemarque::where('name', 'like', '%'.$type['name'].'%');
            if (!isset($item)) {
                TypeRemarque::create(['name' => $type['name']]);
            }
        }

        $unite_mesures = [
            array('name' =>'mettre-carre', 'slug' => 'm2', 'display_name' => 'Mesure en mettre carré'),
            array('name' =>'hectare', 'slug' => 'hct', 'display_name' => 'Mesure en hectare'),

        ];
        foreach ($unite_mesures as $mesure) {
            $item = UniteMesure::where('name', $mesure['name'])->first();
            if (!isset($item)) {
                UniteMesure::create(
               [ 'name' => $mesure['name'], 
               'slug' => $mesure['slug'],
               'display_name' => $mesure['display_name']]);
            }
        }
    }
}

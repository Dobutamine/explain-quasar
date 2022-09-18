#include <iostream>
#include <cmath>
#include <cstdint>
std::uintptr_t i;

using namespace std;

extern "C" {
  struct acidb {
    double ph = 7.40;
    double pco2 = 5.4;
    double hco3 = 24.5;
    double be = 0.0;
  };

  // brent
  double brent_accuracy = 1e-8;
  int max_iterations = 100.0;
  int steps = 0;

  // acid base constants
  double kw = 0.000000000025119;
  double kc = 0.000794328234724;
  double kd = 0.000000060255959;
  double left_hp =  0.000015848931925;
  double right_hp = 0.000158489319246;
  double alpha_co2p = 0.0309;

  double tco2 = 0;
  double albumin = 0;
  double phosphates = 0;
  double sid = 0;
  double uma = 0;
  double hemoglobin = 10;


  double ph = 7.40;
  double pco2 = 0;
  double hco3 = 0;
  double be = 0;

   acidb ab_data = {
    ph = 7.40,
    pco2 = 5.4,
    hco3 = 24.5,
    be = 0.0,
  };


  double net_charge_plasma(double hp_estimate) {
      // calculate the ph based on the current hp estimate
      ph = -log10(hp_estimate / 1000.0);

      // we do know the total co2 concentration but we now have to find out the distribution of the co2 where tco2 = cco2 + hco3 + cco3
      // cco2 = plasma concentration of co2 -> charge neutral
      // hco3 = plasma concentration of bicarbonate -> charge 1-
      // cco3 = plasma concentration of carbonate -> charge 2-

      // the distribution is described by
      // pH = pKc * HCO3 + log10(hco3 / cco2)
      // pH = pKd + log10(cco3 / hco3)

      // calculate the plasma co2 concentration based on the total co2 in the plasma, hydrogen concentration and the constants Kc and Kd
      double cco2p = tco2 / (1.0 + kc / hp_estimate + (kc * kd) / pow(hp_estimate, 2.0));

      // calculate the plasma hco3(-) concentration (bicarbonate)
      double hco3p = (kc * cco2p) / hp_estimate;

      // calculate the plasma co3(2-) concentration (carbonate)
      double co3p = (kd * hco3p) / hp_estimate;

      // calculate the plasma OH(-) concentration (water dissociation)
      double ohp = kw / hp_estimate;

      // calculate the pco2 of the plasma
      double pco2p = cco2p / alpha_co2p;

      // calculate the weak acids (albumin and phosphates)
      // Clin Biochem Rev 2009 May; 30(2): 41-54

      double a_base = albumin * (0.123 * ph - 0.631) + phosphates * (0.309 * ph - 0.469);
      // alb_base = self.albumin * (0.378 / (1.0 + math.pow(10, 7.1 - ph)))
      // phos_base = self.phosphates / (1.0 + math.pow(10, 6.8 - ph))

      // calculate the net charge of the plasma. If the netcharge is zero than the current hp_estimate is the correct one.
      double netcharge = hp_estimate + sid - hco3p - 2.0 * co3p - ohp - a_base - uma;

      // calculate the base excess according to the van Slyke equation
      be = (hco3p - 24.4 + (2.3 * hemoglobin + 7.7) * (ph - 7.4)) * (1.0 - 0.023 * hemoglobin);

      // calculate the pco2 and store the plasma hco3
      pco2 = pco2p;
      hco3 = hco3p;

      // return the net charge to the brent function
      return netcharge;
  }

  double brent_find_root_ab ( double a, double b, double t, int max_iter)
  {
      steps = 0;
      bool result_found = false;
      double c;
      double d;
      double e;
      double fa;
      double fb;
      double fc;
      double m;
      double macheps;
      double p;
      double q;
      double r;
      double s;
      double sa;
      double sb;
      double tol;
  //
  //  Make local copies of A and B.
  //
      sa = a;
      sb = b;
      fa = net_charge_plasma( sa );
      fb = net_charge_plasma ( sb );

      c = sa;
      fc = fa;
      e = sb - sa;
      d = e;

      macheps = 2.220446049250313E-016;

      for ( ; ; )
      {
          steps += 1;
          if (steps > max_iter) {
              break;
          }
          if ( fabs ( fc ) < fabs ( fb ) )
          {
              sa = sb;
              sb = c;
              c = sa;
              fa = fb;
              fb = fc;
              fc = fa;
          }

          tol = 2.0 * macheps * fabs ( sb ) + t;
          m = 0.5 * ( c - sb );

          if ( fabs ( m ) <= tol || fb == 0.0 )
          {
              result_found = true;
              break;
          }

          if ( fabs ( e ) < tol || fabs ( fa ) <= fabs ( fb ) )
          {
              e = m;
              d = e;
          }
          else
          {
              s = fb / fa;

              if ( sa == c )
              {
                  p = 2.0 * m * s;
                  q = 1.0 - s;
              }
              else
              {
                  q = fa / fc;
                  r = fb / fc;
                  p = s * ( 2.0 * m * q * ( q - r ) - ( sb - sa ) * ( r - 1.0 ) );
                  q = ( q - 1.0 ) * ( r - 1.0 ) * ( s - 1.0 );
              }

              if ( 0.0 < p )
              {
                  q = - q;
              }
              else
              {
                  p = - p;
              }

              s = e;
              e = d;

              if ( 2.0 * p < 3.0 * m * q - fabs ( tol * q ) &&
                  p < fabs ( 0.5 * s * q ) )
              {
                  d = p / q;
              }
              else
              {
                  e = m;
                  d = e;
              }
          }
          sa = sb;
          fa = fb;

          if ( tol < fabs ( d ) )
          {
              sb = sb + d;
          }
          else if ( 0.0 < m )
          {
              sb = sb + tol;
          }
          else
          {
              sb = sb - tol;
          }

          fb = net_charge_plasma( sb );

          if ( ( 0.0 < fb && 0.0 < fc ) || ( fb <= 0.0 && fc <= 0.0 ) )
          {
              c = sa;
              fc = fa;
              e = sb - sa;
              d = e;
          }
      }
      return sb;
  }

  void calculate(double _tco2, double _sid, double _albumin, double _phoshates, double _uma) {
      tco2 = _tco2;
      sid = _sid;
      albumin = _albumin;
      phosphates = _phoshates;
      uma = _uma;

      // find the [H+] where the netcharge is zero
      double hp = brent_find_root_ab(left_hp, right_hp, brent_accuracy, max_iterations);

      // construct the bloodgas
      ab_data.ph = -log10(hp / 1000);
      ab_data.pco2 = pco2;
      ab_data.hco3 = hco3;
      ab_data.be = be;

  }

  int getMemAddress() {
    // convert the pointer to the result struct into an integer
    auto i = reinterpret_cast<std::uintptr_t>(&ab_data);

    // return the memory address of the result struct
    return i;
  }


}


// emcc public/libs/acidbase.cpp -s WASM=1 -s EXPORTED_FUNCTIONS="['_calculate','_getMemAddress']" -o public/wasm/acidbase.js

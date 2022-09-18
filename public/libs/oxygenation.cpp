#include <iostream>
#include <cmath>
#include <cstdint>
std::uintptr_t i;

using namespace std;




extern "C" {

  struct oxy {
    double po2 = 100;
    double so2 = 1.0;
  };

  // brent
  double brent_accuracy = 1e-8;
  int max_iterations = 100.0;
  int steps = 0;

  // oxygenation constants
  double left_o2 = 0.01;
  double right_o2 = 100;
  double alpha_o2p = 0.0095;
  double mmoltoml = 22.2674;

  // oxygenation
  double dpg = 5;
  double hemoglobin = 10;
  double temp = 37;
  double to2 = 9.1;
  double po2 = 75;
  double so2 = 0.98;
  double be = 0;
  double ph = 7.40;

  oxy oxy_data = {
    po2 = 100,
    so2 = 1.0
  };



  double oxygen_dissociation_curve(double po2_estimate) {
      // calculate the saturation from the po2 depending on the ph,be, temperature and dpg level.
      double a = 1.04 * (7.4 - ph) + 0.005 * be + 0.07 * (dpg - 5.0);
      double b = 0.055 * (temp + 273.15 - 310.15);
      const double y0 = 1.875;
      double x0 = 1.875 + a + b;
      double h0 = 3.5 + a;
      double k = 0.5343;
      double x = log(po2_estimate);
      double y = x - x0 + h0 * tanh(k * (x - x0)) + y0;

      // return the o2 saturation
      return 1.0 / (pow(2.71828, -y) + 1.0);
  }

  double oxygen_content(double po2_estimate) {
      // calculate the saturation from the current po2 from the current po2 estimate
      so2 = oxygen_dissociation_curve(po2_estimate);

      // calculate the to2 from the current po2 estimate
      // convert the hemoglobin unit from mmol/l to g/dL
      // convert the po2 from kPa to mmHg
      // convert to output from ml O2/dL blood to ml O2/l blood
      double to2_new_estimate = (0.0031 * (po2_estimate / 0.1333) + 1.36 * (hemoglobin / 0.6206) * so2) * 10.0;

      // convert the ml O2/l to mmol/l
      to2_new_estimate = to2_new_estimate / mmoltoml;

      // calculate the difference between the real to2 and the to2 based on the new po2 estimate and return it to the brent root finding function
      double dto2 = to2 - to2_new_estimate;

      return dto2;
  }

  double brent_find_root_oxy ( double a, double b, double t, int max_iter)
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
      fa = oxygen_content( sa );
      fb = oxygen_content ( sb );

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

          fb = oxygen_content( sb );

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

  void calculate(double _to2, double _dpg, double _hemoglobin, double _be, double _temp) {
      to2 = _to2;
      dpg = _dpg;
      hemoglobin = _hemoglobin;
      temp = _temp;

      po2 = brent_find_root_oxy(left_o2, right_o2, brent_accuracy, max_iterations);

      // store the results in memory
      oxy_data.po2 = po2;
      oxy_data.so2 = so2;
  }
  int getMemAddress() {
    // convert the pointer to the result struct into an integer
    auto i = reinterpret_cast<std::uintptr_t>(&oxy_data);

    // return the memory address of the result struct
    return i;
  }

}



// emcc public/libs/oxygenation.cpp -s WASM=1 -s EXPORTED_FUNCTIONS="['_calculate','_getMemAddress']" -o public/wasm/oxygenation.js

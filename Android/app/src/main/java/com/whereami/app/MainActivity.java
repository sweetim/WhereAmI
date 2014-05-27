package com.whereami.app;

import android.app.Activity;
import android.content.Context;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends Activity{

    private TextView textView_data;
    private TextView textView_get;
    private TextView textView_lat;
    private TextView textView_long;
    private TextView textView_time;

    private LocationManager locationManager;

    private float[] gps = new float[2];
    private Long timestamp;
    private int counter;

    private Handler handler = new Handler();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView_data = (TextView) findViewById(R.id.textView_data);
        textView_get = (TextView) findViewById(R.id.textView_get);

        textView_lat = (TextView) findViewById(R.id.textView_lat);
        textView_long = (TextView) findViewById(R.id.textView_long);
        textView_time = (TextView) findViewById(R.id.textView_time);

        Button button_connect = (Button) findViewById(R.id.button_connect);
        Button button_get = (Button) findViewById(R.id.button_get);

        button_connect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new SendJSONWeb().execute("http://zmp-cloud3.cloudapp.net:50001/data");
            }
        });

        button_get.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new JSONWebService().execute("http://zmp-cloud3.cloudapp.net:50001/data");
            }
        });

        LocationManager locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);
        handler.postDelayed(runnable, 100);
    }

    private void timerSend() {
        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                handler.post(runnable);
            }
        }, 0, 250);
    }

    final Runnable runnable = new Runnable() {
        @Override
        public void run() {
            textView_lat.setText(Float.toString(gps[1]) + " " + Integer.toString(counter));
            textView_long.setText(Float.toString(gps[0]));
            timestamp = System.currentTimeMillis();
            textView_time.setText(Long.toString(timestamp));

            new SendJSONWeb().execute("http://zmp-cloud3.cloudapp.net:50001/test");

            handler.postDelayed(this, 100);
        }
    };

    LocationListener locationListener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            gps[0] = (float) location.getLongitude();
            gps[1] = (float) location.getLatitude();
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {
            Log.d("here", "helo3");
        }

        @Override
        public void onProviderEnabled(String provider) {
            Log.d("here", "helo2");
        }

        @Override
        public void onProviderDisabled(String provider) {
            Log.d("here", "helo1");
        }
    };

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }


    private class SendJSONWeb extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            return sendJSONData(urls[0]);
        }

        @Override
        protected void onPostExecute(String result) {
            String status = "", err = "", timestamp = "";
            try {
                JSONObject jsonData = new JSONObject(result);

                timestamp = jsonData.getString("timestamp");
                status = jsonData.getString("result");
                err = jsonData.getString("err");
            } catch (JSONException e) {
                e.printStackTrace();
            }

            textView_data.setText(timestamp + status + err);
        }

        private String sendJSONData(String myurl) {
            HttpURLConnection conn = null;
            try {
                URL url = new URL(myurl);
                conn = (HttpURLConnection) url.openConnection();
                conn.setReadTimeout(10000);
                conn.setConnectTimeout(15000);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");

                conn.setDoInput(true);
                conn.setDoOutput(true);
                conn.connect();

                JSONObject jsonParam = new JSONObject();
                jsonParam.put("user", "hello");
                jsonParam.put("timestamp", timestamp);
                jsonParam.put("long", gps[1]);
                jsonParam.put("lat", gps[0]);

                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write(jsonParam.toString());
                writer.close();
                os.close();


                // handle issues
                int statusCode = conn.getResponseCode();
                if (statusCode != HttpURLConnection.HTTP_OK) {
                    counter++;
                }

                // read output (only for GET)
                InputStream in = new BufferedInputStream(conn.getInputStream());
                return readData(in, 100);

            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (ProtocolException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (JSONException e) {
                e.printStackTrace();
            } finally {
                conn.disconnect();
            }

            return null;
        }

        private String readData(InputStream stream, int len) throws IOException {
            Reader reader = null;
            reader = new InputStreamReader(stream, "UTF-8");
            char[] buffer = new char[len];
            reader.read(buffer);
            return new String(buffer);
        }
    }


    private class JSONWebService extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            return getJSONData(urls[0]);
        }

        @Override
        protected void onPostExecute(String result) {
            String status = "", err = "", lat = "", user = "", timestamp = "", longitude = "";
            try {
                JSONObject jsonData = new JSONObject(result);

                status = jsonData.getString("result");
                err = jsonData.getString("err");

                JSONArray data = jsonData.getJSONArray("data");

                for (int i = 0; i < data.length(); i++) {
                    JSONObject gpsPosition = data.getJSONObject(i);

                    user = gpsPosition.getString("user");
                    timestamp = gpsPosition.getString("timestamp");

                    JSONObject coordinates = new JSONObject(gpsPosition.getString("location"));
                    JSONArray location = coordinates.getJSONArray("coordinates");

                    lat = location.get(0).toString();
                    longitude = location.get(1).toString();
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }

            textView_get.setText(result + " " + err + " " + user + " " + timestamp + " " + lat + " " + longitude);
        }

        private String getJSONData(String myurl) {
            try {
                URL url = new URL(myurl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setReadTimeout(10000);
                conn.setConnectTimeout(15000);
                conn.setRequestMethod("GET");
                conn.setDoInput(true);
                conn.connect();

                int statusCode = conn.getResponseCode();

                if (statusCode == 200) {
                    InputStream is = conn.getInputStream();
                    return readData(is, 1024);
                }
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (ProtocolException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

            return null;
        }

        private String readData(InputStream stream, int len) throws IOException {
            Reader reader = null;
            reader = new InputStreamReader(stream, "UTF-8");
            char[] buffer = new char[len];
            reader.read(buffer);
            return new String(buffer);
        }
    }
}

<?php
/**
 * @package RECO WIDGET PLUGIN
 * @version 5.8
 */
/*
                Plugin Name: USense
                Plugin URI: http://wordpress.org/plugins/custom/
                Description: Usense is an AI-powered User Persona and engagement platform that empowers publishers to enable the most human intuitive discovery of contents or products .
                Author: Recosense
                Version: 5.8
                Author URI: http://recosenselabs.com/
*/ 

/*--------------------------------------- Initial Calling Function ------------------------------------*/

function onInit() 
{
    add_option('plugin_activation', 'activated');

}

/*-------------------------------------Activates / Deactivation On Plugin Installation -----------------------------------*/

register_activation_hook(__FILE__, 'onInit');



/*------------------------------ Function To Activate/Deactivate JS Only Once On Installation -------------------------*/

function activateScriptOnce()
{

    if (is_admin() && get_option('plugin_activation') == 'activated')
    {
        delete_option('plugin_activation');
        wp_register_script('scripts', plugins_url('/main.js', __FILE__) , array(
            'jquery'
        ));
        wp_enqueue_script('scripts');
    }
}


/*--------------------------------------------- Get Total Posts Count-----------------------------------------*/

function getPostCount()
{


    global $wpdb;
    $str = "SELECT count('id') as post_count FROM " . $wpdb->prefix . "posts where post_status='publish' and comment_status='open' and ping_status='open' ";

    $wp_res = $wpdb->get_results($str);
    print_r(json_encode(array('count'=>$wp_res,'lang'=>get_locale(),'version'=>get_bloginfo( 'version' ))));

    die();



}

$ser =  $_SERVER['HTTP_HOST'];


if($ser=='localhost:8000')
{
  $ser = 'localhost';
}



$response = wp_remote_get( 'https://media-get.recosenselabs.com/v1.1/get_wordpress_client?site_domain='.$ser.'' );
$GLOBALS['clientId'];

$vars = get_object_vars ( json_decode($response['body'] ));

foreach($vars as $key=>$value) {

  if($key=='client_id')
  $GLOBALS['clientId']= $value;
}







/*--------------------------------------------- Get Total Posts Data -----------------------------------------*/

function getPostData()
{

    global $wpdb;
    if (isset($_REQUEST))
    {

        if(isset( $_REQUEST['start']))
        {
          $start = $_REQUEST['start'];
          $end = $_REQUEST['end'];
        }

        $str = "SELECT p.post_title,p.post_date,p.post_content,p.comment_count,p.ID,u.user_nicename as author,u.user_url  FROM " . $wpdb->prefix . "posts as p inner join " . $wpdb->prefix . "users as u on p.post_author=u.ID  where p.post_status='publish' and p.comment_status='open' and p.ping_status='open' limit " . $end . "  offset  " . $start . "";

        $wp_res = $wpdb->get_results($str);
        foreach ($wp_res as $row)
        {
            $post_thumbnail_id = get_post_thumbnail_id( $row->ID ); 
            
            
 
            

            $row->url = get_permalink($row->ID);
            $row->comments = getComments($row->ID);
            $row->tags = getTags($row->ID,$row->user_url);
            $row->lang = get_locale();
            $row->img = wp_get_attachment_image_url( $post_thumbnail_id, $size );

        }

        print_r(json_encode($wp_res));
    }

    die();

}



function getPostDataId($post_id)
{

    global $wpdb;
    if (isset($_REQUEST))
    {

        $str = "SELECT p.post_title,p.post_date,p.post_content,p.comment_count,p.ID,u.user_nicename as author,u.user_url  FROM " . $wpdb->prefix . "posts as p inner join " . $wpdb->prefix . "users as u on p.post_author=u.ID  where p.post_status='publish' and p.comment_status='open' and p.ping_status='open' and p.ID =".$post_id." ";

        $wp_res = $wpdb->get_results($str);
        foreach ($wp_res as $row)
        {
            $post_thumbnail_id = get_post_thumbnail_id( $row->ID ); 
            $row->url = get_permalink($row->ID);
            $row->comments = getComments($row->ID);
            $row->tags = getTags($row->ID,$row->user_url);
            $row->lang = get_locale();
            $row->img = wp_get_attachment_image_url( $post_thumbnail_id, $size );

        }

        print_r(json_encode($wp_res));
    }

    die();

}







/*--------------------------------------------- Get Posts Comments  -----------------------------------------*/

function getComments($post_id)
{
    global $wpdb;
    $str = "SELECT c.comment_author,c.comment_date,c.comment_content  FROM " . $wpdb->prefix . "comments as c  where c.comment_post_ID= " . $post_id . " ";
    $wp_res = $wpdb->get_results($str);
    return $wp_res;
}

/*--------------------------------------------- Get Total Posts Tags-----------------------------------------*/


function getTags($post_id,$user_url)
{
    global $wpdb;
    $str = "SELECT t.name,t.slug from ".$wpdb->prefix."terms as t inner join ".$wpdb->prefix."term_relationships as tr on t.term_id=tr.term_taxonomy_id where tr.object_id=".$post_id."";
    $wp_res = $wpdb->get_results($str);
    $tags = array();
    foreach ($wp_res as $row)
    {
        array_push($tags,$row->name);
    }
    return $tags;
}


/*---------------------------------- Redirect To Welcome Screen On Activation  ---------------------------------*/


// function welcome_screen_page()
// {
//     add_dashboard_page('Welcome', 'Welcome', 'read', 'plugin-welcome', 'welcome_page');
// }
// function welcome_page()
// {
//     echo '<div style=" text-align: center; /* margin-top: 4%; */ /* border: 1px solid; */ padding: 112px; background: #d1ffd1; display: flex; justify-content: center; align-items: center; flex-direction: column; width: 65%; margin: 45px auto; -webkit-box-shadow: 1px 3px 5px 5px rgb(202 202 202); -moz-box-shadow: 1px 3px 5px 5px rgba(189,189,189,1); box-shadow: 1px 3px 5px 5px rgb(232 232 232);"><!--<img src="../wp-content/plugins/custom/widget-ico.png">--><h1 style="/* color:red */font-size: 43px;color: #96a9de;line-height: 1;">Plugin Has Been Activated</h1><p style=" font-size: 18px; color: gray;">Here are some tips to get you started quickly.</p></div>';
// }

// function welcome_redirect($plugin)
// {
//     if ($plugin == 'custom/index.php')
//     {
//         wp_redirect(admin_url('index.php?page=plugin-welcome'));
//         die();
//     }
// }



function widgetScript()
{


    
    wp_enqueue_script('widgetScript', plugins_url('/widget.js', __FILE__) , array(
        'jquery'
    ));

    if(!is_admin()){
        wp_reset_query();
        if(get_post_type() === 'post' && !is_category()
        ){
            
            wp_localize_script('widgetScript', 'page_info', array(
                'status' => 'post',"current_id"=>get_the_ID()));
        }
        else{
            if(is_front_page())
            {
                wp_localize_script('widgetScript', 'page_info', array(
                    'status' => 'home',"current_id"=>''));
            }
            else
            {

                wp_localize_script('widgetScript', 'page_info', array(
                    'status' => 'page',"current_id"=>get_query_var('category_name') ));
                
            }
          
        }

    }

    wp_enqueue_style('widgetStyle', plugins_url('/main.css', __FILE__) , array());

}








/* --------------------    Admin page code starts here   ---------------------------------- */



   function menuscripss()
   {
       add_menu_page( 
           'USense',
           'USense', 
           'manage_options',
           'USense',
           'callbackcc'
       );

   }
   
   function callbackcc() 
   {
       switch( $_GET['page'] ) 
       {
           case 'USense':
               echo '<div class="wrapper">
               <div class="cc-cw-cn-wrap">
                  <img src="'.plugin_dir_url( __FILE__ ).'/assets/logo.png" class="logo">
                  <p class="heading-cw">USense</p>
               </div>
               <ul class="list-style">
                  <li class="list-items active">Bands</li>
                  <li class="list-items">Design</li>
               </ul>
               <div classs="content-wrapper">
                  <div class="band-title-cont">
                     <p class="band-name" id="t1">Home Page
                     </p>
                  </div>
                  <button class="add-btn" id="b1" style="
                     display: none;
                     "></button>
                  <div class="card-cc card1">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs1"></span></p>
                        <p class="display_name">Display Name <input id="d1" class="imp" value=""></p>
                        <p class="display_name">Display ID <input id="i1" class="imp left-fix" value=""></p>
                        <div class="checkbox-cont">

                            <button class="band-btn"  id="c1"></button>


                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont1">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont1"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>

                     </div>
                  </div>
                  <button class="add-btn" id="b2" style="
                     display: none;
                     "></button>
                  <div class="card-cc card2">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs2"></span></p>
                        <p class="display_name">Display Name <input id="d2" class="imp" value=""></p>
                        <p class="display_name">Display ID <input id="i2" class="imp left-fix" value=""></p>
                        <div class="checkbox-cont">
                        <button class="band-btn"  id="c2"></button>
                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont2">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont2"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>
                     </div>
                  </div>
                  <button class="add-btn" id="b3" style="
                     display: none;
                     "></button>
                  <div class="card-cc card3">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs3"></span></p>
                        <p class="display_name">Display Name <input id="d3" class="imp" value=""></p>
                        <p class="display_name">Display ID <input id="i3" class="imp left-fix" value=""></p>
                        <div class="checkbox-cont">
                        <button class="band-btn"  id="c3"></button>
                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont3">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont3"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>
                     </div>
                  </div>
                  <button class="add-btn" id="b4" style="
                     display: none;
                     "></button>
                  <div class="card-cc card4">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs4"></span></p>
                        <p class="display_name">Display Name <input id="d4" class="imp" value=""></p>
                        <p class="display_name">Display ID <input id="i4" class="imp left-fix" value=""></p>
                        <div class="checkbox-cont">
                        <button class="band-btn"  id="c4"></button>
                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont4">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont4"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>
                     </div>
                  </div>
                  <div class="band-title-cont">
                     <p class="band-name" id="t2">Category Page
                     </p>
                  </div>
                  <button class="add-btn" id="b5" style="
                     display: none;
                     "></button>
                  <div class="card-cc card5">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs5"></span></p>
                        <p class="display_name">Display Name <input id="d5" class="imp" value=""></p>
                        <p class="display_name">Display ID <input id="i5" class="imp left-fix" value=""></p>
                        <div class="checkbox-cont">
                        <button class="band-btn"  id="c5"></button>
                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont5">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont5"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>
                     </div>
                  </div>
                  <button class="add-btn" id="b6" style="
                     display: none;
                     "></button>
                  <div class="card-cc card6">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs6"></span></p>
                        <p class="display_name">Display Name <input id="d6" class="imp" value=""></p>
                        <p class="display_name">Display ID <input id="i6" class="imp left-fix" value=""></p>
                        <div class="checkbox-cont">
                        <button class="band-btn"  id="c6"></button>
                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont6">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont6"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>
                     </div>
                  </div>
                  <button class="add-btn" id="b7" style="
                     display: none;
                     "></button>
                  <div class="card-cc card7">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs7"></span></p>
                        <p class="display_name">Display Name <input id="d7" class="imp" value=""></p>
                        <p class="display_name">Display ID <input id="i7" class="imp left-fix" value=""></p>
                        <div class="checkbox-cont">
                        <button class="band-btn"  id="c7"></button>
                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont7">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont7"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>
                     </div>
                  </div>
                  <button class="add-btn" id="b8" style="
                     display: none;
                     "></button>
                  <div class="card-cc card8">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs8"></span></p>
                        <p class="display_name">Display Name <input id="d8" class="imp" value=""></p>
                        <p class="display_name">Display ID <input id="i8" class="imp left-fix" value=""></p>
                        <div class="checkbox-cont">
                        <button class="band-btn"  id="c8"></button>
                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont8">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont8"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>
                     </div>
                  </div>
                  <div class="band-title-cont">
                     <p class="band-name" id="t3">Content Details
                     </p>
                  </div>
                  <button class="add-btn" id="b9" style="
                     display: none;
                     "></button>
                  <div class="card-cc card9">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs9"></span></p>
                        <p class="display_name">Display Name <input id="d9" class="imp" value=""></p>
                        <p class="display_name">Display ID <input id="i9" class="imp left-fix" value=""></p>
                        <div class="checkbox-cont">
                        <button class="band-btn"  id="c9"></button>
                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont9">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont9"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>
                     </div>
                  </div>
                  <button class="add-btn" id="b10" style="
                     display: none;
                     "></button>
                  <div class="card-cc card10">
                     <div class="content-text-wrapper">
                        <p class="display_name">Band Status  <span class="enabled" id="bs10"></span></p>
                        <p class="display_name">Display Name <input id="d10" class="imp" value="" readonly></p>
                        <p class="display_name">Display ID <input id="i10" class="imp left-fix" value="" readonly></p>
                        <div class="checkbox-cont">
                        <button class="band-btn"  id="c10"></button>
                        </div>
                     </div>
                     <div class="example">
                        <p class="cw-ref">Please copy and paste the following code snippet at a preferred place on the pages and the responsive band will load with dynamic content.
                        </p>
                        <div class="copy-text" id="cont10">
                           <input type="text"  class="text" value="" />
                           <button class="cpy" data-id="cont10"><i class="fa fa-clone"></i></button>
                        </div>
                        <p class="cw-ref cw-ref-o"><strong>Note : </strong>Please click on save button to update the settings</p>
                     </div>
                  </div>
               </div>
               <button class="submit-btn">Save</button>
               <div class="footer-band">Powered By Recosense 2021</div>
            </div>
            <div class="wrapper wrapper2">
               <div class="cc-cw-cn-wrap">
                  <img src="'.plugin_dir_url( __FILE__ ).'/assets/logo.png" class="logo">
                  <p class="heading-cw">USense</p>
               </div>
               <ul class="list-style">
                  <li class="list-items ">Bands</li>
                  <li class="list-items active">Design</li>
               </ul>
               <p class="header-text-cc">Band Customization</p>
               <div class="container-wrap-cc">
                  <p class="heading-cc">Card Title Font Size</p>
                  <input type="number" id="card_heading_size" class="width" style="
                     margin-left: 128px;
                     ">
                  <select class="dropdown" id="card_heading_size_select">
                     <option value="px">px</option>
                     <option value="%">%</option>
                  </select>
               </div>
               <div class="container-wrap-cc">
                  <p class="heading-cc">Card Title Font Color</p>
                  <span class="palette" id="pal1" ></span>
                  <input type="" id="card_heading_color" class="width" style="
                     margin-left: 116px;
                     ">
                  <main class="dynamic-color">
                     <div class="wrap">
                        <div class="body">
                           <div id="color_picker"></div>
                           <p class="sample">
                              <i class="sample__color"></i>
                              <em class="sample__code"></em>
                           </p>
                        </div>
                        <nav class="controller" style="display: none;">
                           <label>
                              <span>Type: </span>
                              <select onchange="onChangeType(this)">
                                 <option value="default" selected>default</option>
                                 <option value="circle">circle</option>
                                 <option value="mini">mini</option>
                                 <option value="ring">ring</option>
                                 <option value="none">none</option>
                              </select>
                           </label>
                        </nav>
                     </div>
                  </main>
               </div>
               <div class="container-wrap-cc">
                  <p class="heading-cc">Card Arrow Color</p>
                  <span class="palette" id="pal2" ></span>
                  <input type="" id="card_arrow_color" class="width" style="
                     margin-left: 116px;
                     ">
                  <main class="dynamic-color">
                     <div class="wrap">
                        <div class="body">
                           <div id="color_picker1A"></div>
                           <p class="sample">
                              <i class="sample__color"></i>
                              <em class="sample__code"></em>
                           </p>
                        </div>
                        <nav class="controller" style="display: none;">
                           <label>
                              <span>Type: </span>
                              <select onchange="onChangeType(this)">
                                 <option value="default" selected>default</option>
                                 <option value="circle">circle</option>
                                 <option value="mini">mini</option>
                                 <option value="ring">ring</option>
                                 <option value="none">none</option>
                              </select>
                           </label>
                        </nav>
                     </div>
                  </main>
               </div>
               <div class="container-wrap-cc">
                  <p class="heading-cc">Width</p>
                  <input type="number" id="width" class="width" style="
                     margin-left: 217px;
                     " >
                  <select class="dropdown" id="width_select">
                     <option value="px">px</option>
                     <option value="%">%</option>
                  </select>
               </div>
               <p class="info">Please select width between 200px-300px or between 20%-30% </p>
               <div class="container-wrap-cc">
                  <p class="heading-cc">Article Caption Size</p>
                  <input type="number" id="imgc" class="width" style="
                     margin-left: 130px;
                     ">
                  <select class="dropdown" id="imgc_select">
                     <option value="px">px</option>
                     <option value="%">%</option>
                  </select>
               </div>
               <div class="container-wrap-cc">
                  <p class="heading-cc">Article Caption Color</p>
                  <span class="palette" id="pal3" ></span>
                  <input type="" id="imgcc" class="width" style="
                     margin-left: 120px;
                     ">
                  <main class="dynamic-color">
                     <div class="wrap">
                        <div class="body">
                           <div id="color_picker3"></div>
                           <p class="sample">
                              <i class="sample__color"></i>
                              <em class="sample__code"></em>
                           </p>
                        </div>
                        <nav class="controller" style="display: none;">
                           <label>
                              <span>Type: </span>
                              <select onchange="onChangeType(this)">
                                 <option value="default" selected>default</option>
                                 <option value="circle">circle</option>
                                 <option value="mini">mini</option>
                                 <option value="ring">ring</option>
                                 <option value="none">none</option>
                              </select>
                           </label>
                        </nav>
                     </div>
                  </main>
               </div>
               <div class="container-wrap-cc">
                  <button class="support-btn save-custom">Save</button>
               </div>
               <div class="ban-container">
                  <p class="ca-cc-card-title text-center"  id="ca-cc-card-title" >
                     Suggested For You
                  </p>
                  <div class="ban-inner-cont">
                     <svg version="1.1" id="vl-left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330 330" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: white;" xml:space="preserve">
                        <path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
                           l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
                           C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"></path>
                     </svg>
                     <svg version="1.1" id="vl-left-right" xmlns="http://www.w3.org/2000/svg" class="arrow-cv" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330.002 330.002" style="enable-background:new 0 0 330.002 330.002;width: 21px;fill: white;" xml:space="preserve">
                        <path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
                           l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
                           c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"></path>
                     </svg>
                     <div class="cc-ca-wrap item item-pw reco-items" style="
                        width: 245px;
                        ">
                        <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                           <img src="'.plugin_dir_url( __FILE__ ).'/assets/3.jpg" class="ca-cc-tag-card-img">
                           <div class="content-wrapper-section" style="
                              width: 245px;
                              ">
                              <p class="ca-cc-tag-card-img-text" style="
                                 font-size: 18px;
                                 color: white;
                                 " title="Artists used deepfake tech to tell alternate moon landing history">Artists used deepfake tech to tell alternate moon landing history</p>
                              <div class="date-card-container">
                                 <span class="tags-cc">tech</span>
                                 <span class="date-txt" style="
                                    color: white;
                                    ">Jan 01 1900</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="cc-ca-wrap item item-pw reco-items" style="
                        width: 245px;
                        ">
                        <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                           <img src="'.plugin_dir_url( __FILE__ ).'/assets/4.jpg" class="ca-cc-tag-card-img">
                           <div class="content-wrapper-section" style="
                              width: 245px;
                              ">
                              <p class="ca-cc-tag-card-img-text" style="
                                 font-size: 18px;
                                 color: white;
                                 " title="Artists used deepfake tech to tell alternate moon landing history">Artists used deepfake tech to tell alternate moon landing history</p>
                              <div class="date-card-container">
                                 <span class="tags-cc">tech</span>
                                 <span class="date-txt" style="
                                    color: white;
                                    ">Jan 01 1900</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="cc-ca-wrap item item-pw reco-items" style="
                        width: 245px;
                        ">
                        <div class="ca-cc-tag-card-container  ca-cc-tag-click ca-cc-price-content">
                           <img src="'.plugin_dir_url( __FILE__ ).'/assets/5.jpg" class="ca-cc-tag-card-img">
                           <div class="content-wrapper-section" style="
                              width: 245px;
                              ">
                              <p class="ca-cc-tag-card-img-text" style="
                                 font-size: 18px;
                                 color: white;
                                 " title="Artists used deepfake tech to tell alternate moon landing history">Artists used deepfake tech to tell alternate moon landing history</p>
                              <div class="date-card-container">
                                 <span class="tags-cc">tech</span>
                                 <span class="date-txt" style="
                                    color: white;
                                    ">Jan 01 1900</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <p class="header-text-cc">Profile Widget  Customization</p>
               <div class="ca-cc-main-wrapper">
                  <div class="container-wrap-cc">
                     <p class="heading-cc">Widget Icon Color</p>
                     <span class="palette" id="pal4" ></span>
                     <input type="" id="widc" class="width" style="
                        margin-left: 120px;
                        ">
                     <main class="dynamic-color">
                        <div class="wrap">
                           <div class="body">
                              <div id="color_picker1"></div>
                              <p class="sample">
                                 <i class="sample__color"></i>
                                 <em class="sample__code"></em>
                              </p>
                           </div>
                           <nav class="controller" style="display: none;">
                              <label>
                                 <span>Type: </span>
                                 <select onchange="onChangeType(this)">
                                    <option value="default" selected>default</option>
                                    <option value="circle">circle</option>
                                    <option value="mini">mini</option>
                                    <option value="ring">ring</option>
                                    <option value="none">none</option>
                                 </select>
                              </label>
                           </nav>
                        </div>
                     </main>
                  </div>
                  <div class="container-wrap-cc">
                     <p class="heading-cc">Widget Title Color</p>
                     <span class="palette" id="pal5" ></span>
                     <input type="" id="widhc" class="width" style="
                        margin-left: 116px;
                        ">
                     <main class="dynamic-color">
                        <div class="wrap">
                           <div class="body">
                              <div id="color_picker2"></div>
                              <p class="sample">
                                 <i class="sample__color"></i>
                                 <em class="sample__code"></em>
                              </p>
                           </div>
                           <nav class="controller" style="display: none;">
                              <label>
                                 <span>Type: </span>
                                 <select onchange="onChangeType(this)">
                                    <option value="default" selected>default</option>
                                    <option value="circle">circle</option>
                                    <option value="mini">mini</option>
                                    <option value="ring">ring</option>
                                    <option value="none">none</option>
                                 </select>
                              </label>
                           </nav>
                        </div>
                     </main>
                  </div>
                  <div class="container-wrap-cc">
                     <button class="support-btn save-custom">Save</button>
                  </div>
                  <div class="ca-cc-widget-container slide-in from-right show" id="ca-cc-widget-container">
                     <div class="ca-cc-slider-ico" ><img class="ca-cc-slider-img" src="'.plugin_dir_url( __FILE__ ).'/assets/smiley.png"></div>
                     <img src="'.plugin_dir_url( __FILE__ ).'/assets/Group4719.png" class="ca-cc-slider-close-icon" >
                     <section class="ca-sec-proile-section ca-cc-show" id="ca-cc-main-section">
                        <div class="ca-cc-title-container">
                           <img class="ca-cc-title-img" src="'.plugin_dir_url( __FILE__ ).'/assets/Group4742.png">
                           <p class="cc-ca-title-name">User Persona</p>
                        </div>
                        <div class="tabs-container">
                           <button type="button" class="tab-btns active" id="user-profile-tab">User Profile</button>
                           <button type="button" class="tab-btns" id="pers-content-tab">Personalised Content</button>
                        </div>
                        <div id="user-profile-tab-content">
                           <div class="ca-cc-search-container" id="ca-cc-search-container">
                              <div class="ca-cc-serach-box">
                                 <input class="ca-cc-search-inp" placeholder="Search" onkeyup="showSearchContainer(event)">
                                 <img src="'.plugin_dir_url( __FILE__ ).'/assets/Search.png" class="ca-cc-search-icon">
                              </div>
                              <div class="ca-cc-search-items-container" style="display: none;"></div>
                           </div>
                           <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3660804993675643" data-ad-slot="8701058815" data-ad-format="auto" data-full-width-responsive="true"></ins>
                           <div class="ca-cc-content-scroll" id="ca-cc-content-scroll" style="display: block;"></div>
                           <div class="ca-cc-cards">
                              <p class="ca-cc-card-title">tags</p>
                              <p class="ca-cc-card-show-all" data-info="tags" onclick="redirectFn(&quot;tags&quot;,&quot;Show All&quot;)">Show all<img class="ca-cc-show-icon" src="'.plugin_dir_url( __FILE__ ).'/assets/Iconly-Light-outline-Arrow.png"></p>
                              <div class="ca-cc-tag-content">
                                 <p class="ca-cc-tags ca-cc-tag-click" >iphone</p>
                                 <p class="ca-cc-tags ca-cc-tag-click" >james dean</p>
                                 <p class="ca-cc-tags ca-cc-tag-click" >elijah wood</p>
                                 <p class="ca-cc-tags ca-cc-tag-click">entertainment</p>
                                 <p class="ca-cc-tags ca-cc-tag-click" >iphone sizes</p>
                                 <p class="ca-cc-tags ca-cc-tag-click" >star wars</p>
                              </div>
                           </div>
                        </div>
                        <div id="pers-content-tab-content">
                        </div>
                     </section>
                     <section class="ca-sec-tag-detail-section ca-cc-hide" id="ca-cc-detail-section">
                        <div class="ca-cc-title-container ca-cc-title-detail-container">
                           <p class="ca-sec-tag-detail-section-title cc-ca-text-secondary" ><img class="ca-cc-back-icon" src="'.plugin_dir_url( __FILE__ ).'/assets/back-arrow.png">Back</p>
                        </div>
                        <div class="ca-cc-content-scroll ca-cc-content-scroll-detail">
                           <div class="ca-cc-cards ca-cc-wrap-card">
                              <p class="ca-cc-card-title ca-cc-card-desc-title">Most Viewed</p>
                              <div class="ca-cc-tag-content" id="ca-cc-tag-content">
                              </div>
                           </div>
                        </div>
                     </section>
                  </div>
               </div>
               <div class="footer-band">Powered By Recosense 2021</div>
            </div>';
           break;
           case 'myplugin2':
               echo 'second page';
           break;
           default:
               echo 'error';
           break;
       }   
   }



   function addCss() {
    // Custom Style
    echo '<style>
    main {
      /* display: flex; */
      /* align-items: center; */
      /* justify-content: center; */
      /* max-width: 100%; */
      /* height: 100vh; */
      margin-top: -19px;
      /* font-family: sans-serif; */
    }
    
    .wrap {
      padding: 20px;
    }
    
    .body {
      display: flex;
      align-items: center;
    }



    svg#vl-left {
      position: absolute;
      left: 10px;
      top:40%;
  }

  svg#vl-left-right {
    position: absolute;
    right: 10px;
    top:40%;
}


    
    .sample {
      margin: 0 0 0 64px;
      text-align: center;
      border: 1px dashed #aaa;
      border-radius: 8px;
      padding: 30px;
      display: none
    }
    
    .sample__color {
      display: block;
      margin: 0 auto;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 1px solid #ddd;
      background-color: var(--color);
    }
    
    .sample__code {
      display: block;
      margin: 12px 0 0;
      font-style: normal;
      font-size: 12px;
      letter-spacing: -0.25px;
    }
    
    .controller {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 32px -36px 0;
      padding: 32px 0 0;
      border-top: 1px solid #ccc;
    }
    
    .controller>label {
      display: flex;
      align-items: center;
    }
    
    .controller button {
      display: block;
    }
    
    .controller span {
      display: block;
      margin-right: 4px;
      font-size: 14px;
    }
    
    select {
      /* for Firefox */
      -moz-appearance: none;
      /* for Chrome */
      -webkit-appearance: none;
    }
    
    
    /* For IE10 */
    
    select::-ms-expand {
      display: none;
    }
    
    .dropdown {
      height: 4px;
      margin-top: 12px;
      margin-left: 8px;
    }
    
    .text-center {
      text-align: center !important;
      margin: 10px 0px -8px 0px !important;
    }
    
    .ca-cc-card-title {
      text-transform: capitalize !important;
      font-weight: 600;
      text-align: left;
      letter-spacing: 0;
      color: hsl(0deg 0% 49%);
      text-transform: capitalize;
      opacity: 1;
      margin-top: 25px !important;
      margin-bottom: 16px !important;
    }
    
    .tab-btns.active {
      color: #33bbfb !important;
      font-weight: 700;
      border: none !important;
      background-color: #fff;
      border-bottom: 3px solid #33bbfb !important;
    }
    
    .ca-cc-main-wrapper {
      position: relative;
      min-height: 309px;
    }
    
    .ca-cc-content-scroll {
      max-height: 53vh;
      overflow-y: auto;
    }
    
    .ca-cc-content-scroll-detail {
      max-height: 85vh !important;
    }
    
    .ca-cc-content-scroll::-webkit-scrollbar {
      width: 7px;
    }
    
    .ca-cc-content-scroll::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    .ca-cc-content-scroll::-webkit-scrollbar-thumb {
      background: #888;
    }
    
    .ca-cc-content-scroll::-webkit-scrollbar-thumb:hover {
      background: #6d6d6d;
    }
    
    .ca-cc-search-items-container::-webkit-scrollbar {
      width: 7px;
    }
    
    .ca-cc-search-items-container::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    .ca-cc-search-items-container::-webkit-scrollbar-thumb {
      background: #888;
    }
    
    .ca-cc-search-items-container::-webkit-scrollbar-thumb:hover {
      background: #6d6d6d;
    }
    
    .ca-cc-widget-icon-container {
      position: fixed;
      top: 292px;
      right: 0;
      width: 46px;
      height: 155px;
      background: #e96b22 0 0 no-repeat padding-box;
      border-radius: 10px 0 0 10px;
      transition: all 1s ease-in-out;
      opacity: 1;
    } 
    
    .ca-cc-widget-icon-container.align-right {
      right: 372px !important;
    }
    
    .ca-cc-widget-icon {
      position: absolute;
      right: 0;
      top: 10px;
      width: 46px;
      height: 154px;
      opacity: 1;
      cursor: pointer;
      background-size: contain;
    }
    
    .ca-cc-widget-container {
      width: 375px;
      height: 400px;
      background: #fff 0 0 no-repeat padding-box;
      border-radius: 10px;
      opacity: 1;
      border: 1px solid #d8d8d8;
      transition: transform 1s ease;
    }
    
    .slide-in {
      position: absolute;
      top: -25px;
      z-index: 10000;
      position: absolute;
    }
    
    .slide-in.from-right {
      right: -4px;
    }
    
    .ca-cc-widget-container.slide-in.from-right {
      transform: translateX(100%);
      -webkit-transform: translateX(100%);
    }
    
    .ca-cc-widget-container.slide-in.show {
      transform: unset !important;
    }
    
    .ca-cc-slider-close-icon {
      width: 9%;
      position: absolute;
      right: 26px;
      top: -22px;
      cursor: pointer;
    }
    
    .ca-cc-slider-close-icon:hover {
      transform: scale(1.1);
    }
    
    .ca-cc-title-container {
      border-bottom: 1px solid #e3e3e3;
      display: flex;
      padding:12px;
    }
    
    .ca-cc-title-img {
      width: 65px;
      height: 55px;
      margin-top: 8px;
    }
    
    .cc-ca-title-name {
      font-size: 22px;
      font-weight: 700;
      font-family: poppins;
      color: #33BBFB;
      margin-left: 60px;
      position: absolute;
      top:8px;
    }
    
    .ca-cc-profile-container {
      transform: matrix(1, 0, 0, 1, 0, 0);
      opacity: 1;
      border-bottom: 1px solid #e3e3e3;
    }
    
    .ca-cc-profile-img {
      width: 53px;
      height: auto;
      float: left;
      margin-top: 2px;
    }
    
    .ca-cc-title-ecp {
      position: absolute;
      width: 31px;
      top: 42px;
      left: 58px;
    }
    
    .ca-cc-info-container {
      overflow: hidden;
      padding-left: 10px;
    }
    
    .ca-cc-profile-name {
      letter-spacing: 0.01px;
      color: #fff;
      font-size: 18px;
      margin-top: 2px;
      margin-bottom: 4px;
      font-family: poppins;
    }
    
    .ca-cc-profile-email {
      margin-top: -4px !important;
      font-size: 15px;
      letter-spacing: -0.01px;
      color: #fff;
      margin-bottom: 10px !important;
      font-family: poppins;
    }
    
    img.ca-cc-title-ecp.ca-cc-title-ecp1 {
      top: 0;
      left: 11px;
    }
    
    .ca-cc-search-container {
      padding: 5px 10px 0 10px;
      /* display: flex; */
    }
    
    .ca-cc-search-items-container {
      display: none;
      height: 55vh;
      overflow-y: scroll;
    }
    
    .ca-cc-search-items-container .media {
      width: 90%;
      margin-bottom: 20px;
    }
    
    .ca-cc-serach-box {
      position: relative;
      margin: 12px 0 12px 0px;
      width: 99%;
      border-radius: 5px;
      background: #f9f9f9 0 0 no-repeat padding-box;
    }
    
    .ca-cc-search-inp {
      font-size: 15px;
      outline: 0;
      border: none;
      width: 90%;
      background: 0 0;
      height: 37px;
      padding-left: 12px;
    }
    
    .ca-cc-search-icon {
      width: 16px;
      position: absolute;
      top: 12px;
      right: 20px;
    }
    
    .ca-cc-cards {
      position: relative;
      padding: 5px 10px 15px 10px;
      /* border-bottom: 1px solid #e3e3e3; */
    }
    
    .no-content {
      color: #c8c8c8;
      letter-spacing: 1px;
      text-align: center;
      margin-top: -23px;
    }
    
    .ca-cc-cards:last-child {
      border-bottom: none !important;
    }
    

    
    .ca-cc-card-show-all {
      text-align: left;
      font: normal normal normal 16px/51px Poppins;
      letter-spacing: 0;
      color: #33BBFB;
      font-weight: 500;
      position: absolute;
      top: -7px;
      right: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    
    .ca-cc-tag-content {
      display: flex;
      position: relative;
      flex-wrap: wrap;
    }
    
    .ca-cc-tags {
      transition: 400ms;
      -webkit-transition: 600ms;
      border-radius: 6px;
      font-family: "poppins";
      font-size: 14px;
      padding: 9px;
      margin-bottom: 12px;
      margin-right: 9px;
      margin-bottom: 2px;
      cursor: pointer;
      line-height: 1;
      background: #f8f8f8 0% 0% no-repeat padding-box;
      text-transform: capitalize;
    }
    
    .ca-cc-show-icon {
      width: 7px;
      margin-left: 6px;
      margin-right: 7px;
    }
    
    .ca-cc-tag-content:hover {
      cursor: pointer;
    }
    
    .ca-cc-show-icon {
      visibility: hidden;
    }
    
    .ca-cc-card-show-all:hover .ca-cc-show-icon {
      visibility: visible;
    }
    
    .cc-ca-wrap {
      width: 137px;
      text-align: center;
      margin-bottom: 45px;
    }
    

    
    .ca-cc-tag-card-img {
      width: 100%;
      object-fit: contain;
      height: 170px;
    }
    

    
    .cc-ca-add-to-cart {
      width: 100%;
      background: #33bbfb 0 0 no-repeat padding-box;
      border-radius: 0 0 4px 0;
      padding: 6px;
      border: none;
      outline: 0;
      text-align: center;
      font-family: poppins;
      letter-spacing: 0;
      color: #fff;
      opacity: 1;
      cursor: pointer;
    }
    
    .cc-ca-band-add-to-cart {
      font-size: 12px;
      font-weight: 700;
      position: relative;
      top: -15px;
    }
    
    .ca-cc-add-to-cart-img {
      width: 23px;
      vertical-align: middle;
    }
    
    .ca-cc-discounted-price {
      text-align: center;
      text-decoration: line-through;
      font: normal normal normal 15px/50px Poppins;
      letter-spacing: 0;
      color: #abaeb0;
      padding-left: 5px;
    }
    
    .ca-cc-title-detail-container {
      padding: 14px 0 14px 6px !important;
      width: 100%;
    }
    
    .ca-sec-tag-detail-section-title {
      text-align: left;
      width: 89px;
      letter-spacing: 0;
      color: #000;
      cursor: pointer;
      opacity: 1;
      font-size: 20px;
      font-family: poppins;
      margin: 0;
    }
    
    .ca-cc-back-icon {
      width: 18px;
      float: left;
      margin-top: 6px;
      margin-right: 6px;
    }
    
    .ca-cc-cards.ca-cc-wrap-card {
      padding: 0 !important;
    }
    
    .ca-cc-card-desc-title {
      text-align: left;
      font: normal normal normal 19px/51px Poppins;
      letter-spacing: 0;
      opacity: 1;
      padding: 12px 0;
      padding-left: 10px;
      border-bottom: 1px solid #e0e0e0;
      line-height: 1.7;
    }
    
    .cc-ca-wrap.cc-ca-wrap-tag-details {
      display: flex;
      background: #fafdff 0 0 no-repeat padding-box;
      width: 100%;
      margin-bottom: 12px;
      flex-wrap: wrap;
      position: relative;
    }
    
    .ca-cc-tag-card-img.cc-mr-3 {
      width: 93px;
      height: 82px;
      object-fit: unset !important;
      margin-top: 8px;
      margin-right: 10px;
    }
    
    .ca-cc-tag-detail-card-img-text {
      text-align: left;
      font: normal normal normal 14px/51px Poppins !important;
      letter-spacing: 0;
      color: #000;
      margin-bottom: -15px;
      margin-top: 0;
      width: unset !important;
      line-height: 31px;
    }
    
    .cc-ca-add-to-cart.cc-mr-3 {
      height: 35px;
      width: 135px;
      font-size: 14px;
      display: flex;
      display: flex;
      margin-top: 16px;
      position: absolute;
      right: 5%;
      top: 27px;
      align-items: center;
    }
    
    .ca-cc-cart-added {
      background: #f8f8f8 0 0 no-repeat padding-box !important;
      color: #000 !important;
    }
    
    .ca-cc-add-to-cart-img.cc-pr-2 {
      width: 23px;
      vertical-align: middle;
    }
    
    .cc-pr-2 {
      padding-right: 5px;
    }
    
    .cc-ca-wrap.cc-ca-wrap-tag-details {
      padding: 0 7px;
      margin-bottom: 12px;
    }
    
    .ca-cc-show {
      display: block;
    }
    
    .ca-cc-hide {
      display: none;
    }
    
    .profile-card {
      position: relative;
      background: #fff;
      padding: 8px;
      border-radius: 4px;
      box-shadow: 0 0 2px 0 #ccc;
      /* background: transparent linear-gradient(103deg, #33bbfb 0%, #0c87c0 100%) 0%
            0% no-repeat padding-box; */
      background: #33BBFB;
      padding-left: 15px;
    }
    
    .profile-icon {
      width: 64px;
      margin-right: 16px;
      float: left;
      margin-top: -9px;
    }
    
    .profile-name {
      font-size: 20px;
      margin: -2px 0 3px 0;
      color: #fff;
      font-family: "SFProDisplay";
    }
    
    .profile-position {
      font-size: 16px;
      margin-top: 8px;
      color: #ffff;
      font-family: "SFProDisplay";
    }

    #t2,#t3
    {
      margin-top: 30px !important;
      /* margin-bottom: 23px !important; */
      position: relative;
      top: 0;
    }
    
    .recent-posts-widget .posts-thumb {
      position: relative;
    }
    
    .mr-3 {
      margin-right: 1rem !important;
    }
    
    .d-flex {
      display: -ms-flexbox !important;
      display: flex !important;
    }
    
    .posts-thumb img {
      width: 100%;
      max-height: 200px;
      object-fit: contain;
      margin: auto;
      margin-top: 15px;
      background-color: #f5f5f5;
    }
    
    .posts-thumb a {
      width: 100%;
    }
    
    .category-meta-bg {
      position: absolute;
      top: -22px;
      left: 0;
      z-index: 1;
    }
    
    .media-body {
      -ms-flex: 1;
      flex: 1;
      text-align: left;
    }
    
    .media {
      width: 90%;
      padding: 10px;
      letter-spacing: 1.1px;
      line-height: 1.4;
      font-size: 16px;
      font-family: SFProDisplay;
      text-align: center;
      margin: auto;
      margin-top: 10px;
      box-shadow: 0px 0px 3px #ccc;
      border-radius: 5px;
      margin-bottom: 10px;
      display: block !important;
    }
    
    .media:last-child {
      border-bottom: none !important;
    }
    
    .category-meta-bg a {
      background: #415fa3 !important;
      color: #fff;
      text-decoration: none;
    }
    
    .elementor a {
      -webkit-box-shadow: none;
      box-shadow: none;
      text-decoration: none;
    }
    
    .category-meta-bg a {
      position: relative;
      font-size: 10px;
      padding: 0 6px;
      margin-right: 5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #fff !important;
      height: 20px;
      line-height: 20px;
      display: inline-block;
      transition: 400ms;
      -webkit-transition: 400ms;
      font-weight: 700;
    }
    
    .posts-thumb.d-flex.mr-3 {
      position: relative;
      justify-content: center;
      align-items: center;
    }
    
    .post-title {
      margin-bottom: 0;
      margin-top: 8px;
    }
    
    .post-title a {
      color: #1c1c1c;
      text-decoration: none;
      font-weight: 500;
    }
    
    .post-meta time {
      color: #888;
      font-size: 12px;
      text-transform: capitalize;
    }
    
    .post-meta {
      margin-top: 10px;
    }
    
    .ca-cc-main-block-title.ca-cc-blue {
      border-bottom: 1px solid #1e88e5;
    }
    
    .ca-cc-main-block-title.ca-cc-title-arrow.ca-cc-blue span {
      background: #1e88e5;
      color: #fff;
    }
    
    .ca-cc-main-block-title.ca-cc-title-arrow.ca-cc-blue>span:after {
      border-color: #1e88e5 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) !important;
    }
    
    .ca-cc-main-block-title.ca-cc-light-blue {
      border-bottom: 1px solid #00bdb3;
    }
    
    .ca-cc-main-block-title.ca-cc-title-arrow.ca-cc-light-blue span {
      background: #00bdb3;
      color: #fff;
    }
    
    .ca-cc-main-block-title.ca-cc-title-arrow.ca-cc-light-blue>span:after {
      border-color: #00bdb3 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) !important;
    }
    
    .ca-cc-main-block-title {
      font-size: 14px;
      line-height: 100%;
      text-transform: uppercase;
      margin: 0 0 40px;
    }
    
    .ca-cc-main-block-title.ca-cc-title-arrow span {
      height: 30px;
      line-height: 30px;
      padding: 8px 15px;
      position: relative;
    }


    p.cw-ref {

        margin-left: 11px;
        /* width: 50%; */
        margin-bottom: 0;
        margin-top: -9px;
    
  }
    
    .ca-cc-main-block-title.ca-cc-title-arrow>span:after {
      position: absolute;
      content: " ";
      width: auto;
      height: auto;
      bottom: -20px;
      margin-left: -10px;
      left: 50%;
      border-width: 10px;
      border-style: solid;
    }
    
    .cc-ca-article-container {
      padding: 13px;
    }
    
    .ca-cc-article-img {
      width: 100%;
    }
    
    .ca-cc-article-desc {
      line-height: 1.6;
    }
    
    #parent {
      font-size: 17px;
      line-height: 1.5;
    }
    
    #parent p.collapse:not(.show) {
      height: 186px !important;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    #parent a.collapsed:after {
      content: "Read More";
    }
    
    #parent a:not(.collapsed):after {
      content: "Read Less";
    }
    
    a.collapsed {
      text-decoration: underline;
      color: #000;
    }
    
    #loader1 {
      width: 95px;
      margin: 150px auto;
    }
    
    .ca-cc-slider-ico {
      border-bottom-left-radius: 7px;
      position: absolute;
      top: 237px;
      left: -57px;
      background: #33BBFB;
      padding: 15px;
      border-top-left-radius: 7px;
      cursor: pointer;
    }
    
    .ca-cc-slider-img {
      width: 26px;
      animation: rotation 2s infinite linear;
    }
    
    @keyframes rotation {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(359deg);
      }
    }
    
    .ca-cc-ellipsis-1 {
      position: absolute;
      width: 10%;
      top: 6px;
      left: 4px;
    }
    
    .ca-cc-ellipsis-2 {
      position: absolute;
      width: 37px;
      left: 67px;
      top: 50px;
    }
    
    #loader2 {
      /* width: 95px; */
      width: 29%;
      margin: 209px 36%;
    }
    



.card1:after {
  

  content: "Suggested For You";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}

.card2:after {
  

  content: "Latest News";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}
.card3:after {
  

  content: "Trending News";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}
.card4:after {
  

  content: "People You Follow";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}
.card5:after {
  

  content: "Suggested For You";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}
.card6:after {
  

  content: "Latest News";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}
.card7:after {
  

  content: "Trending News";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}
.card8:after {
  

  content: "People You Follow";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}
.card9:after {
  

  content: "More Like This";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}
.card10:after {
  

  content: "More From General, Actors, Athlete, Places";
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 17px;
  font-size: 15px;
  /* font-weight: 700; */
  background-color: #f5f5f5;
  color: #2a2a2c;
  border-radius: 4px 0 4px 0;

}





    #loader3 {
      width: 29%;
      margin-left: 34%;
      margin-top: 17%;
    }
    
    .no-res-found {
      width: 100%;
    }
    
    .no-res-text {
      text-align: center;
      font-size: 18px;
    }
    
    .tabs-container {
      display: flex;
      justify-content: space-around;
      margin-right: 3px;
      margin-left: 1px;
    }
    
    .tab-btns {
      width: 100%;
      background-color: #fff;
      border: none;
      border-bottom: 3px solid #f7f7f7;
      outline: none;
      padding: 15px 0px 15px 0px;
      font-family: "SFProDisplay";
      cursor: pointer;
    }
    
    .tab-btns:hover {
      color: #33bbfb;
    }
    
    .tab-btns.active {
      color: #33bbfb;
      font-weight: 700;
      border-bottom: 3px solid #33bbfb;
    }
    
    #user-profile-tab {
      letter-spacing: 1px;
      font-size: 15px;
    }
    
    #pers-content-tab {
      letter-spacing: 1px;
      font-size: 15px;
    }
    
    #pers-content-tab-content {
      display: none;
    }
    
    .pers-content-error-message {
      width: 56%;
      color: #acacac;
      text-align: center;
      position: relative;
      top: 70px;
      left: 80px;
    }
    
    #pers-content-tab-content {
      height: 62vh;
      overflow-y: scroll;
      overflow-x: hidden;
      padding-top: 10px;
    }
    
    #pers-content-tab-content {
      max-height: 85vh !important;
    }
    
    #pers-content-tab-content::-webkit-scrollbar {
      width: 7px;
    }
    
    #pers-content-tab-content::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    #pers-content-tab-content::-webkit-scrollbar-thumb {
      background: #888;
    }
    
    #pers-content-tab-content::-webkit-scrollbar-thumb:hover {
      background: #6d6d6d;
    }
    
    .tab-btns:focus {
      outline: none;
    }
    
    .ca-cc-search-inp::placeholder {
      color: #000;
    }
    

    .ban-inner-cont {
      display: flex;
      position: relative;
      /* overflow: hidden; */
      /* flex-direction: column; */
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      height: 300px;
      overflow: hidden;
      padding: 0 40px 0 40px;
  }

      .ban-container {
        border: 1px solid #dedede;
        /* width: 85%; */
        margin: 0 auto;
        border-radius: 8px;
        text-align: center;
        position: relative;
    }
    
    
    .item {
      display: inline-block;
      position: relative;
      vertical-align: top;
      overflow: hidden;
      border: 1px solid #dcdcdc;
      margin-right: 14px;
      min-height: 252px;
      background: #fff;
    }
    

    .ca-cc-tag-card-container.ca-cc-tag-click.ca-cc-price-content {
      height: 255px;
  }
    
    .ca-cc-tag-card-img {
      width: 100%;
      /* object-fit: contain; */
      height: 170px;
    }



    .cc-carousal .cc-slider-content .item {
      display: inline-block;
      width: 24%;
      position: relative;
      vertical-align: top;
      overflow: hidden;
      /* border: 1px solid #dcdcdc; */
      margin-right: 14px;
      min-height: 252px;
  }



.ca-cc-tag-card-img:hover {
  transform: scale(1.3); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
  cursor:pointer;
}

.content-wrapper-section {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 14px;
  text-align: left;
}

.ca-cc-tag-card-img-text {
  text-align: left;
  width: 85%;
  /* font: normal normal normal 15px/51px Poppins; */
  /* letter-spacing: 0; */
  /* color: #000; */
  /* margin-bottom: -29px; */
  /* margin-top: -15px; */
  /* text-overflow: ellipsis; */
  /* width: 97%; */
  overflow-x: hidden;
  margin: 0 !important;
  line-height: 1.6;
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.date-card-container {
  /* margin-left: -18px; */
  margin-top: 16px;
}

span.tags-cc {
  text-transform: capitalize !important;
  font-size: 11px;
  letter-spacing: 1px;
  background: #ffa53b;
  color: #000;
  font-weight: 600;
  padding: 3px 10px 3px 10px;
}

span.date-txt {
  font-size: 12px;
  margin-left: 7px;
  font-weight: 500;
}


.ca-cc-tag-card-img {
  width: 100%;
  object-fit: cover;
  height: 255px;
  overflow: hidden;
  filter: brightness(50%);
  transition: transform .5s;
}
    

    
    p.header-text-cc {
      font-size: 16px;
      margin-top: 38px;
      margin-bottom: 29px;
    }
    
    .container-wrap-cc {
      display: flex;
      position:relative;
    }
    
    p.heading-cc {
      font-size: 14px;
      font-weight: 700;
      color: gray;
    }
    
    .width {
      height: 31px;
      margin-top: 12px;
      margin-left: 17px;
      width: 9%;
    }
    
    .checkbox-cont {
      display: flex;
      margin: 25px 15px 13px 0px;
      position: absolute;
      right: 0;
      top: -34px;
    }
    
    .container {
      display: block;
      position: relative;
      padding-left: 35px;
      margin-bottom: 12px;
      cursor: pointer;
      font-size: 15px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    .container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    
    /* Create a custom checkbox */
    
    .checkmark {
      position: absolute;
      top: -3px;
      left: 8px;
      height: 22px;
      width: 22px;
      background-color: #eee;
    }
    
    
    /* On mouse-over, add a grey background color */
    
    .container:hover input~.checkmark {
      background-color: #ccc;
    }
    
    
    /* When the checkbox is checked, add a blue background */
    
    .container input:checked~.checkmark {
      background-color: #51b3e1;
    }
    
    
    /* Create the checkmark/indicator (hidden when not checked) */
    
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    
    
    /* Show the checkmark when checked */
    
    .container input:checked~.checkmark:after {
      display: block;
    }
    
    .container .checkmark:after {
      left: 8px;
      top: 4px;
      width: 4px;
      height: 9px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate( 45deg);
      -ms-transform: rotate(45deg);
      transform: rotate( 45deg);
    }
    
    .save {
      padding: 5px;
      width: 104px;
      background: #fff;
      border: 1px solid #bdbdbd;
      font-size: 15px;
      cursor: pointer;
      outline: none;
      color: #606060;
      border-radius: 5px;
      margin-top: 10px;
    }
    
    button.submit-btn {
      float: right;
      padding: 11px;
      width: 104px;
      background: #4aa9d5;
      border: 1px solid #bdbdbd;
      font-size: 15px;
      cursor: pointer;
      outline: none;
      color: #ffffff;
      border-radius: 5px;
      margin-top: 20px;
    }
    
    .footer-band {
      margin-top: 81px;
      text-align: center;
      color: gray;
      font-size: 15px;
      border-top: 1px dotted grey;
      padding-top: 22px;
    }
    
    .wrapper {
      background: white;
      padding: 33px;
      border-radius: 14px;
      /* box-shadow: 6px 1px 5px 0px rgb(164 164 164 / 75%); */
      /* -webkit-box-shadow: 6px 1px 5px 0px rgb(164 164 164 / 75%); */
      -moz-box-shadow: 6px 1px 5px 0px rgba(164, 164, 164, 0.75);
      margin: 0 auto;
    }
    
    .wrapper2 {
      background: white !important;
      display: none;
      max-width: 97% !important;

    }
    p#t1 {
      margin-top: 26px;
      position: relative;
      top: -2px;
  }
    span.enabled {
      margin-left: 54px;
      color: #236d23;
    }


    .cc-cw-cn-wrap {
      display: flex;
  }
    
    img.logo {
      width: 21%;
      margin-left: -47px;
    }
    p.heading-cw {
      font-size: 25px;
      position: relative;
      left: -38px;
      top: 4px;
      /* font-weight: 700; */
      /* color: #8e8e8e; */
  }

.cw-ref-o 
{
  margin-top: 3px !important;
  color: #0173aa;

}

.cw-ref-o strong
{
  color:black;
}

  
    button.support-btn {
      float: right;
      padding: 11px;
      width: 100px;
      margin-top: 25px;
      margin-bottom: 25px;
      background: #4aa9d5;
      border: 1px solid #bdbdbd;
      font-size: 15px;
      cursor: pointer;
      outline: none;
      color: #ffffff;
      border-radius: 5px;
    }
    
    .band-name {
      font-size: 17px;
      color: #000000;
      margin-bottom: 28px;
      position: relative;
      top: 15px;
      margin-top: 40px;
      font-weight: 400;
    }
    
    .title-cont {
      margin-bottom: -49px;
    }
    
    .removed {
      color: red !important;
    }
    
    .add-btn {
      float: right;
      float: right;
      position: relative;
      top: 55px;
      right: 16px;
      padding: 5px;
      background: #0f9a0f;
      width: 104px;
      border: 1px solid #bdbdbd;
      font-size: 15px;
      cursor: pointer;
      outline: none;
      color: white;
      border-radius: 5px;
      margin: 15px 0 15px 0;
    }
    
    .card-cc {
      position:relative;
      border: 1px solid #d7d7d7;
      border-radius: 5px;
      padding: 33px 0px 0px 0px;
      margin-top: 29px;
      clear: both;
      background: #fff;
      -webkit-box-shadow: 4px 2px 5px 0px rgb(218 218 218);
      -moz-box-shadow: 4px 2px 5px 0px rgba(189,187,189,1);
      box-shadow: 4px 2px 5px 0px rgb(225 225 225)
    }
    
    .content-text-wrapper {
      position: relative;
      padding: 0 20px 0 30px;
    }
    
    .script_enclose {
      padding: 18px 20px 0 30px;
      border-top: 1px solid #dedede;
    }
    
    cc-cw-cn-wrap {
      display: flex;
  }



    p.display_name {
      font-size: 13px;
      color: #424242;
    }

    .content-wrapper-section
    {
    width:unset !important;
    }
    
    .imp {
      width: 72%;
      padding: 9px;
      margin-left: 40px;
      border: 1px solid #cbcbcb;
      color: #424242;
      border-radius: 5px;
      font-size: 13px;
      outline: none;
    }
    
    .system-name {
      width: 100% !important;
      padding: 4px;
      margin-left: 4px;
      border: 1px solid #cbcbcb;
      color: gray;
      border-radius: 5px;
      font-size: 15px;
      outline: none;
    }
    
    .left-fix {
      margin-left: 62px !important;
    }



    p.info {
      margin-left: 260px;
  }
    
    img.more-ico {
      position: absolute;
      bottom: 0;
      right: 11px;
      cursor: pointer;
    }
    
    .script_enclose {
      font-size: 15px;
    }
    
    ul.list-style {
      display: flex;
    }
    
    li.list-items {
      font-size: 16px;
      cursor: pointer;
      color: #040404;
      padding-right: 49px;
      margin-bottom: 0;
      padding-left: 21px;
      padding-bottom: 9px;
      border: 1px solid #dadada;
      padding-top: 0px;
      width: 50%;
      padding-top: 9px;
    }
    
    .list-items.active {
      background: rgb(74 169 213);
      color: #fff !important;
      border: 1px solid #4aa9d5 !important
    }
    
    #widhc,
    #widc,
    #card_heading_color,#card_arrow_color,.dynamic-color,
    #imgcc {
      display: none;
    }

    span#pal2 {
      margin-left: 142px !important;
  }


  main.dynamic-color {
    position: absolute;
    right: 44%;
    z-index: 9999999;
    top: 44%;
}

  span#pal3 {
    margin-left: 121px !important;
}

  span#pal5 {
    margin-left: 113px !important;
}

    .palette {
      width: 34px;
      cursor:pointer;
      height: 23px;
      border: 1px solid gray;
      border-radius: 5px;
      margin-top: 14px;
      margin-left: 117px;

  }

  textarea:focus, input:focus{
    outline: none !important;
}


  .example {
    position: relative;
    margin: 15px 0 0;
    padding: 26px 19px 14px;
    background-color: #fff;
    border-radius: 4px 4px 0 0;
    border-top: 1px solid #ddd;
    z-index: 2;
}


input#foo {
    width: 92%;
    padding: 6px;
    pointer-events: none;
}





.copy-text {
  position: relative;
  padding: 10px;
  background: #fff;
  /* border: 1px solid #ddd; */
  border-radius: 10px;
  display: flex;
}
.copy-text input.text {
  /* padding: 10px; */
  font-size: 13px;
  /* color: #fff; */
  border: 1px solid #d6d6d6;
  outline: none;
  width: 60%;
  pointer-events: none;
   background: #efefef; 
  /* font-weight: 700;*/
}
.copy-text button {
	padding: 10px;
    background: #51b3e1;
    color: #fff;
    font-size: 18px;
    border: none;
    outline: none;
    border-radius: 8px;
    cursor: pointer;
    width: 40px;
}

.copy-text button:active {
	background: #809ce2;
}
.copy-text button:before {
  content: "Copied";
  position: absolute;
  top: -27px;
  background: #5c81dc;
  padding: 8px 10px;
  border-radius: 20px;
  font-size: 15px;
	display: none;
}
.copy-text button:after {
  content: "";
  position: absolute;
  top: 0px;
  width: 10px;
  height: 10px;
  background: #5c81dc;
  transform: rotate(
45deg
);
  display: none;
  margin-left: 24px;
}
.copy-text.active button:before,
.copy-text.active button:after {
	display: block;
}








.band-btn {
  display: none;
  padding: 5px;
  width: 87px;
  height: 29px;
  margin-top: -19px;
  background: #fff;
  border: 2px solid #cacaca;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
  letter-spacing: 1px;
  font-weight: 600;
}


.disabled
{
  background: #ff3838f7 !important;
  border: 2px solid #ff0000 !important;
  color: #fff;
}


.enable {
  background: #14a35b !important;
  border: 1px solid #14a35b !important;
  color: #fff;
}



  </style>';
    // Our JS
    // echo '<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>';

}




function setLocalVar() {
  global $current_user; wp_get_current_user();

  $user_name = 'Guest';
  if ( is_user_logged_in() ) { 
    $user_name = $current_user->display_name; 
  } 

    echo '<script type="text/javascript">
             var clc = "'.$GLOBALS['clientId'].'";
            var ajaxurl = "' . admin_url('admin-ajax.php') . '";
            var loggedUser = "' . $user_name . '";
          </script>
          ';
 }



 function enquestylescss() {

  wp_enqueue_script( 'my_custom_script',  plugin_dir_url( __FILE__ ).'admin.js', array(), '5.8' );

  wp_register_style( 'custom_wp_admin_css1',  plugin_dir_url( __FILE__ ).'js/EasyLogicColorPicker.css', false, '5.8' );
  wp_enqueue_style( 'custom_wp_admin_css1' );


  wp_register_style( 'custom_wp_admin_css2',  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css', false, '5.8' );
  wp_enqueue_style( 'custom_wp_admin_css2' );

  wp_enqueue_script( 'my_custom_script1',   plugin_dir_url( __FILE__ ).'js/EasyLogicColorPicker.js', array(), '5.8' );



}
add_action( 'admin_enqueue_scripts', 'enquestylescss' );





 /*-------------------- Hooks ----------------------------------------*/

 add_action('publish_post', 'publishPostTrigger');
 function publishPostTrigger($post_id) {


    $post_thumbnail_id = get_post_thumbnail_id( $post_id ); 
    $body = array(
        'client_id'    => $GLOBALS['clientId'],


        'items'=> array(
            (object) array(
             'item_id'=>   ''.$post_id.'',
            'title' => get_the_title($post_id),
            'description' => get_post($post_id),
            'image' => wp_get_attachment_image_url( $post_thumbnail_id, $size ),
            'item_type' => 'posts',
            'language' => 'english',
            'published_date' => '',
            'url' => get_permalink($post_id),
            'category' =>getTags($post_id,'')
            )
        )
        
        
        );
    

        $url = "http://media-get.recosenselabs.com/v1.1/update_content";

        $body = wp_json_encode( $body );
     
        $options = [
            'body'        => $body,
            'headers'     => [
                'Content-Type' => 'application/json',
            ],
            'timeout'     => 60,
            'redirection' => 5,
            'blocking'    => true,
            'httpversion' => '1.0',
            'sslverify'   => false,
            'data_format' => 'body',
        ];
         
        wp_remote_post( $url, $options );



 }




add_action( 'wp_trash_post', 'trashposttrigger' );
function trashposttrigger( $postid ) {

    $url = "http://media-get.recosenselabs.com/v1.1/delete_content";

    
    $headers = array(
    
        'Content-Type: application/json',
        'Accept:*/*'


    );
    $pst = $postid;
    $body = array(
        'client_id'    => $GLOBALS['clientId'],
        'items'   => ''.$pst.''
    
    );

     
    $body = wp_json_encode( $body );
     
    $options = [
        'body'        => $body,
        'headers'     => [
            'Content-Type' => 'application/json',
        ],
        'timeout'     => 60,
        'redirection' => 5,
        'blocking'    => true,
        'httpversion' => '1.0',
        'sslverify'   => false,
        'data_format' => 'body',
    ];
     
    wp_remote_post( $url, $options );

  
}


function plugindeactivativationscript()
{

   $body = array(
      'client_id' => $GLOBALS['clientId'],
      "action_type"=>"plugin_deactivated",
      "channel"=>"",
      "app_ver"=>"1",
      "device_id"=> "",
      "user_id"=> "",
      "timestamp"=> "",
      "http_origin"=> "",
      "user_ip_address"=>""
   );
      
      $url = "https://media-post.recosenselabs.com/v1.1/webhooks";
    

      $body = wp_json_encode( $body );
     
      $options = [
          'body'        => $body,
          'headers'     => [
              'Content-Type' => 'application/json',
          ],
          'timeout'     => 60,
          'redirection' => 5,
          'blocking'    => true,
          'httpversion' => '1.0',
          'sslverify'   => false,
          'data_format' => 'body',
      ];
       
      wp_remote_post( $url, $options );


   
}

register_deactivation_hook( __FILE__, "plugindeactivativationscript");







/*--------------------------------------------- Wordpress Dependency Hooks -----------------------------------------*/

add_action('init', 'activateScriptOnce');


add_action('wp_ajax_getPostCount', 'getPostCount');
add_action('wp_ajax_getPostData', 'getPostData');
add_action('wp_enqueue_scripts', 'widgetScript');
add_action('admin_menu', 'menuscripss');
add_action('admin_head', 'addCss');
add_action('wp_head', 'setLocalVar');







?>

$(document).ready(function() {

    var codegen_html_template = `
    <p>Prediction set, human help, executed action:</p>
    <pre class="codegen"><code class="language-python">{code}</code></pre>`;
        $('[id^="code_"]').each(function() {
            var id = this.id;
            domain_name_cmd_idx = id.substring(5);
            var sep_idx = domain_name_cmd_idx.indexOf('_');
            var domain_name = domain_name_cmd_idx.substring(0, sep_idx);
            var cmd_idx_str = domain_name_cmd_idx.substring(sep_idx + 1);
    
            var codegen_file = 'https://explore-eqa.github.io/uncertainty/' + domain_name + '/' + cmd_idx_str + '.txt';
            $.get(codegen_file, function(data) {
                // var highlighted_code = hljs.highlight(data, {language: 'python'}).value;
                var highlighted_code = data;
                var html_code = codegen_html_template
                                    .replace('{code}', highlighted_code)
                                    // .replace('{link}', codegen_file)
                                    ;
                $(html_code).appendTo("#" + id);
             }, 'text');
        });
    
        var current_cmd_idxs = {
            "sim": 1,
            "real": 1,
        }
    
        var vid_start_times = {
            "sim": {
                1: 0 * 60 + 0,
                2: 0 * 60 + 5,
                3: 0 * 60 + 20,
                4: 0 * 60 + 58,
                5: 1 * 60 + 37,
                6: 2 * 60 + 4,
                7: 2 * 60 + 44,
            },
            "real": {
                1: 0 * 60 + 0,
                2: 0 * 60 + 23,
                3: 0 * 60 + 45,
            },
        }
    
        var vid_end_times = {
            "sim": {
                1: 0 * 60 + 5,
                2: 0 * 60 + 20,
                3: 0 * 60 + 58,
                4: 1 * 60 + 37,
                5: 2 * 60 + 4,
                6: 2 * 60 + 44,
                7: 3 * 60 + 13,
            },
            "real": {
                1: 0 * 60 + 22,
                2: 0 * 60 + 44,
                3: 1 * 60 + 5,
            },
        }
    
        function playSeg(vid, start_time, end_time, domain_name, desired_cmd_idx) {
            vid.play();
            vid.pause();
            vid.currentTime = start_time;
            vid.play();
    
            // console.log("start and end: " + start_time.toString() + ", " + end_time.toString());
    
            var pausing_function = function() {
                // console.log("checking pausing function cb for " + domain_name);
                // console.log("current and end time");
                // console.log(this.currentTime);
                // console.log(end_time)
                if (this.currentTime >= end_time) {
                    // console.log("reached end time");
                    this.pause();
                    this.removeEventListener("timeupdate", pausing_function);
                }
            };
    
            // console.log("adding timeupdate pausing_function for " + domain_name + "_" + desired_cmd_idx.toString());
            vid.addEventListener("timeupdate", pausing_function);
        }
    
        // demos
        $('select').on('change', function() {
            var sep_idx = this.value.indexOf('_');
            var domain_name = this.value.substring(0, sep_idx);
            var desired_cmd_idx = parseInt(this.value.substring(sep_idx + 1));
            var current_cmd_idx = current_cmd_idxs[domain_name];
            
            // hide current content
            var current_content = $('#content_' + domain_name + "_" + current_cmd_idx.toString());
            current_content.hide();
    
            // show desired content
            var desired_content = $('#content_' + domain_name + "_" + desired_cmd_idx.toString());
            desired_content.show();
    
            // switch videos
            // if (domain_name.startsWith("mobile")) {
            //     var current_vid = $('#vid_1_' + domain_name + "_" + current_cmd_idx.toString()).get(0);
            //     var desired_vid = $('#vid_1_' + domain_name + "_" + desired_cmd_idx.toString()).get(0);
            //     current_vid.pause();
            //     desired_vid.play();
            // } else {
            var vid = $("#vid_" + domain_name)[0];
            var start_time = vid_start_times[domain_name][desired_cmd_idx];
            var end_time = vid_end_times[domain_name][desired_cmd_idx];
            playSeg(vid, start_time, end_time, domain_name, desired_cmd_idx);
            // }
    
            // set current to desired
            current_cmd_idxs[domain_name] = desired_cmd_idx;
        });
    });
    
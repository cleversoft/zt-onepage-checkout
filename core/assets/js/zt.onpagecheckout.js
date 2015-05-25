/**
 * Zt onepagecheckout
 * @param {type} w
 * @param {type} z
 * @param {type} $
 * @returns {undefined}
 */
(function (w, z, $) {
    /* Reject if zt is not defined */
    if (typeof (z) === 'undefined') {
        console.log('Error: Zt Javsacript Framework not available.');
        return false;
    }
    /* Reject if ajax isn't loaded */
    if (typeof (z.ajax) === 'undefined') {
        console.log('Error: Zt ajax not available.');
        return false;
    }

    /* Local onpagecheckout class */
    var _onepagecheckout = {
        /* Local settings */
        _settings: {
        },
        _init: function () {
            var self = this;
            /* Hook login form */
            $(w.document).ready(function () {
                self._rebind();
            });
            self.ajax._parent = self;
        },
        /* Local ajax */
        ajax: {
            /* Local ajax settings */
            _settings: {
                data: {
                    zt_cmd: "ajax",
                    zt_namespace: "Ztonepage",
                    option: "com_virtuemart",
                    view: "cart",
                    format: "json"
                }
            },
            /**
             * Form hook
             * @param {type} selector
             * @param {type} data
             * @returns {Boolean}
             */
            formHook: function (selector, data) {
                if ($(selector).length <= 0) {
                    return false;
                }
                var self = this;
                var data = (typeof (data) === 'undefined') ? {} : data;
                var buffer = {};
                $.extend(true, buffer, self._settings);
                $.extend(true, buffer, data);
                z.ajax.formHook(selector, buffer, true, function () {
                    self._parent._rebind();
                });
            },
            /**
             * Ajax request
             * @param {type} data
             * @returns {undefined}
             */
            request: function (data) {
                var self = this;
                var data = (typeof (data) === 'undefined') ? {} : data;
                var buffer = {};
                $.extend(true, buffer, self._settings);
                $.extend(true, buffer, data);
                z.ajax.request(buffer).done(function(){
                    self._parent._rebind();
                });
            }
        },
        /**
         * Request Joomla user login
         * @returns {undefined}
         */
        login: function () {
            this.ajax.formHook('#zt-opc-login', {
                data: {
                    zt_task: "userLogin"
                }
            });
        },
        guestCheckout: function () {
            this.ajax.formHook('#zt-opc-user', {
                data: {
                    zt_task: "guestCheckout"
                }
            });
        },
        /**
         * Display
         * @returns {undefined}
         */
        display: function () {
            this.ajax.request({
                data: {
                    zt_task: 'display'
                }
            });
        },
        /**
         * Request Joomla user register
         * @returns {undefined}
         */
        register: function () {
            this.ajax.formHook('#zt-opc-registration', {
                data: {
                    zt_task: "registerUser"
                }
            });
        },
        /**
         * Update bill to function
         * @returns {undefined}
         */
        updateBillTo: function () {
            this.ajax.formHook('#zt-opc-billto-form', {
                data: {
                    zt_task: "updateBillTo"
                }
            });
        },
        /*
         * Update purchase form
         * @returns {undefined}
         */
        updatePurchaseConfirm: function () {
            var $form = $('#zt-opc-purchase-form');
            if($form.length > 0){
                var $tos = $form.find('[type="checkbox"]');
                var $submit = $form.find('[type="submit"]');
                if($tos.length > 0){
                    $tos.off('click');
                    $submit.prop('disabled', true);
                    $tos.on('click', function(){
                        if($(this).is(':checked')){
                            $submit.removeAttr('disabled');
                        }else{
                            $submit.prop('disabled', true);
                        }
                    });
                }
            }
            this.ajax.formHook('#zt-opc-purchase-form', {
                data: {
                    zt_task: "updatePurchaseConfirm",
                    confirm: 1
                }
            });
        },
        /**
         * Form validation
         * @returns {undefined}
         */
        formValidation: function(){
            $('.required').filter(':not("#email_field")').attr('data-validation', 'required');
            $('#email_field').attr('data-validation', 'email');
            $.validate();
        },
        /**
         * Update ship to
         * @returns {undefined}
         */
        updateShipTo: function () {
            this.ajax.formHook('#zt-opc-shipto-form', {
                data: {
                    zt_task: "updateShipTo"
                }
            });
        },
        /**
         * Update coupon code
         * @returns {undefined}
         */
        updateCounponCode: function () {
            this.ajax.formHook('#zt-opc-coupon-form', {
                data: {
                    zt_task: "updateCouponCode"
                }
            });
        },
        /**
         * Update cart quantity
         * @param {type} pKey
         * @returns {undefined}
         */
        updateCartQuantity: function (pKey) {
            this.ajax.request({
                data: {
                    zt_task: "updateCartQuantity",
                    pKey: pKey,
                    quantity: $('#zt-opc-shoppingcart-pid-' + pKey).val()
                }
            });
        },
        /**
         * Remove cart item
         * @param {type} pKey
         * @returns {undefined}
         */
        removeCartItem: function (pKey) {
            $('#zt-opc-shoppingcart-pid-' + pKey).val(0);
            this.updateCartQuantity(pKey);
        },
        /**
         * Rebind function
         * @returns {undefined}
         */
        _rebind: function () {
            var self = this;
            self.login();
            self.register();
            self.guestCheckout();
            self.updateBillTo();
            self.updatePurchaseConfirm();
            self.updateShipTo();
            self.updateCounponCode();
            self.formValidation();
        }
    };

    /* Append to Zt JS Framework */
    z.onepagecheckout = _onepagecheckout;
    z.onepagecheckout._init();
    
    $(w.document).ready(function(){
        $('.vm2-add_quantity_cart').unbind('onclick');
        $('.vm2-remove_quantity_cart').unbind('onclick');
    });

})(window, zt, zt.$);

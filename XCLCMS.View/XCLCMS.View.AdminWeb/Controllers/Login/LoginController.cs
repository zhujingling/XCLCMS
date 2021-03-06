﻿using System;
using System.Web.Mvc;

namespace XCLCMS.View.AdminWeb.Controllers.Login
{
    /// <summary>
    /// 登录controller
    /// </summary>
    public class LoginController : XCLCMS.Lib.Base.AdminBaseController
    {
        /// <summary>
        /// 验证码所在session名
        /// </summary>
        private static readonly string ValidCodeSessionName = "ValidCodeSession";

        /// <summary>
        /// 登录
        /// </summary>
        public ActionResult Logon()
        {
            if (XCLCMS.Lib.Login.LoginHelper.IsLogOn)
            {
                return RedirectToAction("Index", "Default");
            }
            return View("~/Views/Login/Logon.cshtml");
        }

        /// <summary>
        /// 退出
        /// </summary>
        public ActionResult LogOut()
        {
            XCLCMS.Lib.Login.LoginHelper.SetLogInfo(Lib.Login.LoginHelper.LoginType.OFF, null);
            return RedirectToRoute("LoginShortURL");
        }

        /// <summary>
        /// 生成验证码
        /// </summary>
        public void GenerateValidCode()
        {
            string code = XCLNetTools.FileHandler.VerificationCode.GenerateCheckCode();
            Session[ValidCodeSessionName] = code;
            XCLNetTools.FileHandler.VerificationCode.CreateCheckCodeImage(code);
        }

        [HttpPost]
        public ActionResult LogonSubmit(FormCollection form)
        {
            string code = (form["txtValidCode"] ?? "").Trim();
            XCLNetTools.Message.MessageModel msgModel = new XCLNetTools.Message.MessageModel();
            if (!string.Equals(Convert.ToString(Session[ValidCodeSessionName]), code, StringComparison.OrdinalIgnoreCase))
            {
                msgModel.Message = "验证码输入不正确！";
                return Json(msgModel);
            }

            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Open.LogonCheckEntity>(XCLCMS.Lib.Login.LoginHelper.GetInnerUserToken());
            request.Body = new Data.WebAPIEntity.RequestEntity.Open.LogonCheckEntity();
            request.Body.UserName = (form["txtUserName"] ?? "").Trim();
            request.Body.Pwd = form["txtPwd"] ?? "";
            var response = XCLCMS.Lib.WebAPI.OpenAPI.LogonCheck(request);
            if (null != response && response.IsSuccess)
            {
                XCLCMS.Lib.Login.LoginHelper.SetLogInfo(XCLCMS.Lib.Login.LoginHelper.LoginType.ON, response.Body);
            }

            return Json(response);
        }
    }
}
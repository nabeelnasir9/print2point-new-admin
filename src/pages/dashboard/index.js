import React, { useEffect, useState } from "react";
import { SideMenu, LineChart, ActivityChart } from "../../components";
import Grid from "@mui/material/Grid";
import "./index.css";
import { Graph } from './../../svg';
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";

const MetricBox = ({ heading, value, image }) => (
  <div className="dashboard-box">
    <p className="dashboard-box-heading">{heading}</p>
    <p className="dashboard-box-value">{value}</p>
    {image && <img src={image} alt={heading} />}
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalAgents: 0,
    activeOrders: 0,
    completedOrders: 0,
    activeAgents: 0,
  });

  const agent_token = localStorage.getItem("admin_access_token");

  const fetchMetrics = async () => {
    try {
      if (!agent_token) throw new Error("Please re-login and try again");
      setLoading(true);

      const [ordersRes, agentsRes, customersRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/admin/print-jobs`, {
          headers: { Authorization: `Bearer ${agent_token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/print-agents`, {
          headers: { Authorization: `Bearer ${agent_token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/admin/customers`, {
          headers: { Authorization: `Bearer ${agent_token}` },
        }),
      ]);

      const totalOrders = ordersRes.data.printJobs.length;
      const completedOrders = ordersRes.data.printJobs.filter(
        (job) => job.payment_status === "completed"
      ).length;
      const activeOrders = totalOrders - completedOrders;

      const totalAgents = agentsRes.data.printAgents.length;
      const activeAgents = agentsRes.data.printAgents.filter(
        (agent) => agent.is_available
      ).length;

      const totalCustomers = customersRes.data.customers.length;

      setMetrics({
        totalOrders,
        totalCustomers,
        totalAgents,
        activeOrders,
        completedOrders,
        activeAgents,
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Internal server error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <SideMenu>
      <div className="page-header">
        <div />
        <p>Dashboard</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <div className="dashboard-header-dropdown">
                <p>Timeframe:</p>
                <select>
                  <option>All</option>
                  <option>A</option>
                </select>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <div className="dashboard-header-dropdown">
                <p>People:</p>
                <select>
                  <option>All</option>
                  <option>A</option>
                </select>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <div className="dashboard-header-dropdown">
                <p>Topic:</p>
                <select>
                  <option>All</option>
                  <option>A</option>
                </select>
              </div>
            </Grid> */}
          </Grid>
          <Grid container spacing={2} style={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
              <Grid container spacing={2}>
                {/* Metric boxes for Orders, Customers, and Agents */}
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                  <MetricBox
                    heading="Total Orders"
                    value={metrics.totalOrders}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                  <MetricBox
                    heading="Active Orders"
                    value={metrics.activeOrders}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                  <MetricBox
                    heading="Completed Orders"
                    value={metrics.completedOrders}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                  <MetricBox
                    heading="Total Customers"
                    value={metrics.totalCustomers}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                  <MetricBox heading="Total Agents" value={metrics.totalAgents} />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                  <MetricBox heading="Not Active Agents" value={metrics.activeAgents} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={5} xl={5}>
              <div className="dashboard-box">
                <div className="dashboard-activity-main">
                  <p>Activity</p>
                  <select>
                    <option>Month</option>
                  </select>
                </div>
                <ActivityChart />
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </SideMenu>
  );
};

export default Dashboard;
